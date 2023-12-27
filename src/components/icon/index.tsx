import { useRef } from 'react';
import icons from '../../assets/svgs/icons';
import { IconType } from '../../utils';

interface IconProps {
  name: IconType;
  size?: number;
  color?: string;
  classname?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

const Icon = ({ name, size = 24, color, classname, style, onClick, ...rest }: IconProps) => {
  const iconRef = useRef(null);

  const SelectedIcon = icons[name];
  if (!SelectedIcon) {
    return null;
  }

  const foundIcon = iconRef.current;

  if (foundIcon && color) {
    try {
      // @ts-ignore
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      foundIcon.children[0].style.fill = color;
    } catch (e) {
      console.log(e);
    }
  }
  return <SelectedIcon ref={iconRef} {...rest} className={classname} style={{ width: size, height: size, ...style }} onClick={onClick} />;
};

export default Icon;
