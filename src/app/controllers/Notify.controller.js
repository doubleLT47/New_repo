
const notificationModel = require('../model/notifications');

const PAGE_SIZE = 10;

class Notify {
    index(req,res){
        let user = req.user;
        return res.render('notifies/facultyList', {user: user.toObject()});
    }

    viewNotify(req, res) {
        let user = req.user;
        res.render('notifies/allNotify', {user: user.toObject()})
    }
    viewNotifyWithThematic(req, res) {
        let user = req.user;
        let theme = req.params.thematic;
        res.render('notifies/notifyWithThematic', {user: user.toObject(), theme: theme})
    }

    showListNotice(req,res){
        let data = [];
        let page = parseInt(req.query.page) || 1;
        var skip = (page -1)*PAGE_SIZE;

        notificationModel.find({})
            .sort({createAt: -1})
            .skip(skip)
            .limit(PAGE_SIZE)
            .then((notifies) => {
                let i = notifies.length;
                if (i === 0) {
                   return res.send(JSON.stringify(data));
                }
                notifies.map((notify) => data.push(notify.toObject()));
                res.send(JSON.stringify(data));
            })
            .catch((err) => res.json({message: 'server not responding'}))
    }

    showNotifyWithThematic(req, res) {
        let data = [];
        let page = parseInt(req.query.page) || 1;
        var skip = (page -1)*PAGE_SIZE;
        let theme = req.params.thematic;
        console.log(theme);

        notificationModel.find({thematic: theme})
            .sort({createAt: -1})
            .skip(skip)
            .limit(PAGE_SIZE)
            .then((notifies) => {
                let i = notifies.length;
                if (i === 0) {
                   return res.send(JSON.stringify(data));
                }
                notifies.map((notify) => data.push(notify.toObject()));
                res.send(JSON.stringify(data));
            })
            .catch((err) => res.json({message: 'server not responding'}))
    }
  
    deleteOneNotice(req, res, next) {
        notificationModel.deleteOne({_id: req.params.id})
            .then(() => res.redirect('/admin/notifications'))
            .catch(next)
    }
}

module.exports = new Notify;
