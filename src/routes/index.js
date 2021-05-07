
const siteRouter= require('./site.route')
const authRouter= require('./auth.route')
const adminRouter= require('./admin.route')
const postRouter = require('./post.route');
const notifyRouter = require('./notify.route');
const commentRouter = require('./comment.route');

function route(app) {
    app.use('/', siteRouter);
    app.use('/auth', authRouter);
    app.use('/admin', adminRouter);
    app.use('/post', postRouter);
    app.use('/notify', notifyRouter);
    app.use('/comment', commentRouter);
}

module.exports = route;