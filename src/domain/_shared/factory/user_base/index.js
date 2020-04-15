class UserBaseFactory {
    static validateEmailAddress (email) {
        return /\S+@\S+\.\S+/.test(email);
    }
}

module.exports = UserBaseFactory;