const secrets = {
  dbUri: "mongodb+srv://admin:Goldilocks493!@cluster0-7wzdn.mongodb.net/recipebook?retryWrites=true&w=majority"
};
const getSecret = key => secrets[key];

module.exports = getSecret;