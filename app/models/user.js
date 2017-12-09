var mongoose = require('mongoose');
var bcrypt= require('bcrypt');

var userSchema = mongoose.Schema({
	local: {
		email: {type:String,required:true,unique:true},
		password: {type:String, required:true},
        firstname: String,
        lastname: String,
		telephone: String,
		resetPasswordToken:String,
		resetPasswordExpires: Date
	}
});

userSchema.methods.generateHash = function(password){
	return bcrypt.hashSync(password,bcrypt.genSaltSync(9));
}

userSchema.methods.validPassword = function(password){
	return bcrypt.compareSync(password,this.local.password);
}
module.exports = mongoose.model('User', userSchema);