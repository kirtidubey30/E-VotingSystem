var config = module.exports;

config.express = {
	port: process.env.PORT || "3000",
	host: "localhost",
};

config.key = {
	privateKey: "cdac-pkey",
	tokenExpiry: "1h", // 1 hour
};

config.mongodb = {
	host: "mongodb://localhost:27017/cdac-election",
};
