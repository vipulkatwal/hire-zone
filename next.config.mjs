/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "vipul-hire-zone.s3.amazonaws.com",
			},
		],
	},
};

export default nextConfig;
