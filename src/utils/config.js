// @ts-check

/** @type {import("./pre-config").RemotePatterns} */
const remotePatterns = [
  {
    protocol: "https",
    hostname: "**.redd.it",
    pathname: "/**",
  },
  {
    protocol: "https",
    hostname: "**.ytimg.com",
    pathname: "/**",
  },
  {
    protocol: "https",
    hostname: "**.discordapp.com",
    pathname: "/**",
  },
];

const imageRegex = new RegExp(
  String.raw`^https:\/\/([a-z0-9]+[.])*(${remotePatterns.reduce(
    (domains, pattern) => `${pattern.hostname.split("**.")[1]}|` + domains,
    ""
  )})\/(.*)\.(gif|jpe?g|tiff?|png|webp|bmp|tga)$`,
  "i"
);

const whitelistedHostsHint = "Reddit and Discord";

module.exports = {
  remotePatterns: remotePatterns,
  imageRegex: imageRegex,
  whitelistedHostsHint: whitelistedHostsHint,
};
