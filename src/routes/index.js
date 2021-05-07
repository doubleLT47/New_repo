
const siteRouter= require('./site.route')
const authRouter= require('./auth.route')
const adminRouter= require('./admin.route')
const facultyRouter= require('./faculty.route')
const postRouter = require('./post.route');
const notifyRouter = require('./notify.route');

function route(app) {
    app.use('/', siteRouter);
    app.use('/auth', authRouter);
    app.use('/admin', adminRouter);
    app.use('/faculty', facultyRouter);
    app.use('/post', postRouter);
    app.use('/notify', notifyRouter);
}

module.exports = route;