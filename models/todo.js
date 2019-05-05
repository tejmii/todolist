var mongoose = require('mongoose');
var Schema	 = mongoose.Schema;

var todoSchema = new Schema({
	task: String,
	status: { type: String, default: 'new' },
	user: {
		type: Schema.ObjectId,
		ref:"user"
	}
});

mongoose.model('todo', todoSchema);