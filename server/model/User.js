module.exports = class User {
    /**
     * @type {String}
     * @public
     */
    id

    /**
     * @type {String}
     * @public
     */
    name

    /**
     * @type {String}
     * @public
     */
    password

     /**
     * @type {String}
     * @public
     */
    email

     /**
     * @type {Auth}
     * @public
     */
    auth

    /**
     * @type {String}
     * @public
     */
    role

    /**
     * 
     * @param {User} data
     */
    constructor(data) {
        this.id = data.id
        this.name = data.name
        this.password = data.password
        this.email = data.email
        this.auth = data.auth
        this.role = data.role
    }
}