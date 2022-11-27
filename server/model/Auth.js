module.exports = class Auth {
    /**
     * @type {String}
     * @public
     */
    id

    /**
     * @type {String}
     * @public
     */
    refreshToken

    /**
     * @type {Date}
     * @public
     */
    refreshTokenExpirationDate

    /**
     * @type {User}
     * @public
     */
    user

    /**
     * 
     * @param {Auth} data
     */
    constructor(data) {
        this.id = data.id
        this.refreshToken = data.refreshToken
        this.refreshTokenExpirationDate = data.refreshTokenExpirationDate
        this.user = data.user
    }
}