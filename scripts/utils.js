/**
 * Shared utility functions for the extension
 */

/**
 * Extract major version from various semver formats
 * @param {string} version - Version string (e.g., "^4.0.0", "~4.0.0", ">=4.0.0", "4.x")
 * @returns {number|null} Major version number or null if invalid
 */
function getMajorVersion(version) {
  if (!version) return null;
  // Handle ranges like ^4.0.0, ~4.0.0, >=4.0.0, >4.0.0, 4.x, etc.
  const match = version.match(/^[~^>=<]*(\d+)/);
  return match ? parseInt(match[1], 10) : null;
}

module.exports = {
  getMajorVersion
};
