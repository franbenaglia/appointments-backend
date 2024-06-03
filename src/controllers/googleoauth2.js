
exports.notLogged = (req, res) => {
    res.json({ message: "You are not logged in" })
}

exports.failed = (req, res) => {
    res.send("Failed")
}

exports.success = (req, res) => {
    res.send(`Welcome ${req.user.email}`)
}