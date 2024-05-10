const redis = require('redis')

const client = redis.createClient({
    password: '4arw2fF8Ta3P3r2BZb5iN2HcNbB13KlI', // Replace with actual password (avoid hardcoding)
    socket: {
        host: 'redis-16339.c305.ap-south-1-1.ec2.redns.redis-cloud.com',
        port: 16339
    }
});

(async () => {
    try {
        await client.connect();
        console.log('Connected to Redis server');
    } catch (error) {
        console.error('Error connecting to Redis:', error);
        // Handle connection error here (e.g., retry connection attempt)
    }
})();

async function storeUserInCache(user, username) {
    try {
        await client.setEx(`user:${username}`, 3600, JSON.stringify(user));
    } catch (error) {
        console.error('Error storing user in cache:', error);
        // Handle caching error here (e.g., log error, fallback to non-cached logic)
    }
}

async function getCachedUser(username) {
    try {
        const cachedUser = await client.get(`user:${username}`);
        if (cachedUser) {
            return JSON.parse(cachedUser);
        }
    } catch (error) {
        console.error('Error retrieving user from cache:', error);
        // Handle retrieval error here (e.g., log error, return null or default value)
    }
    return null;
}

async function getCachedRemainders() {
    try {
        const cachedRemainders = await client.get('cached_remainders');
        if (cachedRemainders) {
            return JSON.parse(cachedRemainders);
        }
        return null;
    } catch (error) {
        console.error('Error retrieving cached remainders:', error);
        // Handle potential Redis errors here (e.g., log the error)
        return null;
    }
}

async function storeRemaindersInCache(remainders) {
    try {
        await client.setEx('cached_remainders', 3600, JSON.stringify(remainders)); // Cache for 1 hour
    } catch (error) {
        console.error('Error storing remainders in cache:', error);
        // Handle potential Redis errors here (e.g., log the error)
    }
}

async function getCachedTransactions() {
    try {
        const cachedTransaction = await client.get('cached_transactions');
        if (cachedTransaction) {
            return JSON.parse(cachedTransaction);
        }
        return null;
    } catch (error) {
        console.error('Error retrieving cached transaction:', error);
        // Handle potential Redis errors here (e.g., log the error)
        return null;
    }
}

async function storeTransactioInCache(transactions) {
    try {
        await client.setEx('cached_transactions', 3600, JSON.stringify(transactions)); // Cache for 1 hour
    } catch (error) {
        console.error('Error storing transactions in cache:', error);
        // Handle potential Redis errors here (e.g., log the error)
    }
}
module.exports = { storeUserInCache, getCachedUser, getCachedRemainders, storeRemaindersInCache, storeTransactioInCache, getCachedTransactions };
