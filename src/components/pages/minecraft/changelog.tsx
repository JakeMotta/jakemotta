import React, { useEffect, useState } from 'react';
import { FiDownload, FiX } from 'react-icons/fi';
import { Markdown } from '../../atoms';
import { Release } from '../../../common/modpack';
import changelogs from '../../../common/modpack-changelogs.json';
import { useDialogMotion } from './dialog-motion';

interface ChangeLog {
  comparison: string;
  added: string[];
  changed: string[];
  removed: string[];
}
const history: Record<string, ChangeLog> = changelogs;

/** A native modal keeps keyboard focus here and lets Escape return to the release button. */
export const ReleaseChangelog = ({ release, onClose }: { release: Release | null; onClose: () => void }) => {
  const motion = useDialogMotion(!!release, onClose);
  const entry = release ? history[release.version] : undefined;
  const [notes, setNotes] = useState({ version: '', text: '', failed: false });


  // Future releases still open in-page even before a curated history entry is written.
  useEffect(() => {
    if (!release || entry) return;
    const controller = new AbortController();
    setNotes({ version: '', text: '', failed: false });
    fetch(release.notes, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error('Notes unavailable');
        return response.text();
      })
      .then((text) => {
        if (!controller.signal.aborted) setNotes({ version: release.version, text: text.replace(/\r\n/g, '\n'), failed: false });
      })
      .catch(() => {
        if (!controller.signal.aborted) setNotes({ version: release.version, text: '', failed: true });
      });
    return () => controller.abort();
  }, [release, entry]);

  const close = motion.close;
  return (
    <dialog
      ref={motion.dialog}
      className="modpack-changelog modpack-release-dialog"
      data-closing={motion.closing || undefined}
      aria-labelledby="modpack-changelog-title"
      onClose={motion.closed}
      onCancel={motion.cancel}
      onClick={(event) => {
        if (event.target === event.currentTarget) close();
      }}
    >
      {release && (
        <div className="modpack-changelog__content">
          <header className="modpack-changelog__header">
            <div>
              <p className="modpack__eyebrow">Change log</p>
              <h3 id="modpack-changelog-title">{release.version}</h3>
            </div>
            <button type="button" onClick={close} aria-label="Close change log" autoFocus>
              <FiX />
            </button>
          </header>
          <div className="modpack-changelog__body">
            {entry ? (
              <>
                <p className="modpack-changelog__comparison">{entry.comparison}</p>
                {(
                  [
                    ['Added', entry.added],
                    ['Changed', entry.changed],
                    ['Removed', entry.removed],
                  ] as [string, string[]][]
                )
                  .filter(([, rows]) => rows.length > 0)
                  .map(([heading, rows]) => (
                    <section key={heading}>
                      <h4>{heading}</h4>
                      <ul>
                        {rows.map((row) => (
                          <li key={row}>{row}</li>
                        ))}
                      </ul>
                    </section>
                  ))}
              </>
            ) : notes.version !== release.version ? (
              <p role="status">Loading the change log…</p>
            ) : notes.failed ? (
              <p role="alert">This change log couldn’t load. Close it and try again.</p>
            ) : (
              <Markdown text={notes.text} />
            )}
          </div>
          <footer>
            <a className="modpack__button" href={release.client.url} download>
              <FiDownload /> Download {release.version}
            </a>
          </footer>
        </div>
      )}
    </dialog>
  );
};
