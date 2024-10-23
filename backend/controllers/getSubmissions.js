const {submissions} = require("../models/submissions");

exports.getSubmissionsController = (req, res) => {
    const { ques } = req.params;
    if(req.session.isLoggedIn === false || req.session.isLoggedIn === undefined){
        return res.json({status:false , message: "Not loggedin" }); 
    }
    const username = req.session.user.user;
    let query;
    if (ques) {
        query = submissions.find({ user: username, name: ques });
    } else {
        query = submissions.find({ user: username });
    }

    query.then(sub => {
        if (sub.length === 0) {
            return res.json({ status: false, message: "No submissions found" });
        }
        return res.json({ status: true, submissions: sub});
    })
    .catch(error => {
        console.error("Error fetching submissions:", error);
        return res.status(500).json({ status: false, message: "Internal server error" });
    });
};

exports.submissionViewController = (req, res) => {
    const submissionId = req.params.id;

    submissions.findById(submissionId).then(submission => {
        if (!submission) {
            return res.status(404).json({ status: false, message: 'Submission not found' });
        }
        return res.json({ status: true, submission : submission });
    }).catch(error => {
        console.error("Error fetching submission:", error);
        return res.status(500).json({ status: false, message: "Internal server error" });
    });
}
