export default class UserModel {
    id = '';
    firstName = '';
    profileImage = '';

    constructor (id, firstName, profileImageUri){
        this.id = id;
        this.firstName = firstName;
        this.profileImage = profileImageUri;
    }
}