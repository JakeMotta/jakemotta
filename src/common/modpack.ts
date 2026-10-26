import { useEffect, useState } from 'react';

/**
 * The Progression Survival modpack's releases. Everything about them comes from releases.json,
 * which scripts/release-modpack.mjs writes, so shipping a new version never needs the site to change.
 */

export const PACK_DIR = '/downloads/progression-survival';

export interface ReleaseFile {
    name: string;
    url: string;
    bytes: number;
    sha256: string;
}

export interface Release {
    version: string;
    prerelease: boolean;
    published: string;
    minecraft: string;
    neoforge: string;
    java: number;
    summary: string;
    notes: string;
    checksums: string;
    client: ReleaseFile;
    server: ReleaseFile;
}

export const formatSize = (bytes: number) => (bytes < 1024 * 1024 ? `${Math.round(bytes / 1024)} KB` : `${(bytes / 1024 / 1024).toFixed(1)} MB`);

export const formatDate = (date: string) => new Date(`${date}T00:00:00`).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });

/** The releases, newest first; `null` while loading, and `failed` if the list didn't load */
export const useReleases = () => {
    const [releases, setReleases] = useState<Release[] | null>(null);
    const [failed, setFailed] = useState(false);

    useEffect(() => {
        let live = true;
        // no-cache so a page left open in a tab still finds a release shipped since.
        fetch(`${PACK_DIR}/releases.json`, { cache: 'no-cache' })
            .then((response) => {
                if (!response.ok) throw new Error(`${response.status}`);
                return response.json();
            })
            .then((index) => live && setReleases(index.releases))
            .catch(() => live && setFailed(true));
        return () => {
            live = false;
        };
    }, []);

    return { releases, failed };
};
