import { memo } from 'react';
import { useQuery } from 'react-query';
import { userAPIHook } from '../../hooks/reactQuery';
import './index.scss';

export const UserProfileModal = memo(() => {
  const { getUser } = userAPIHook();

  const { data: user } = useQuery('user', getUser);

  return (
    <div className="common-modal user-profile-modal-wrapper">
      <div className="item-wrapper">
        <div className="item-title smallRegular">Name:</div>
        <div className="item-value mediumMedium">
          {user?.firstName} {user?.lastName}
        </div>
      </div>

      <div className="item-wrapper">
        <div className="item-title smallRegular">Email:</div>
        <div className="item-value mediumMedium">{user?.email}</div>
      </div>
    </div>
  );
});
