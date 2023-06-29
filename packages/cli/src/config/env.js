/**
 * check dev env
 * @returns boolean true is dev
 */
export function isDev() {
    return process.env.NODE_ENV === 'development';
}
