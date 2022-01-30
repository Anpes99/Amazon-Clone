module.exports = {
  images: {
    domains: ["links.papareact.com", "fakestoreapi.com"], // whitelists these
  },
  env: {
    stripe_public_key: process.env.STRIPE_PUBLIC_KEY,
  },
};
