module.exports = (router, nodecg) => {
    router.post("/chat", (req, res) => {
        const { name } = req.body;
        const { avatar } = req.body;
        const { content } = req.body;
        if (typeof name === "string" && typeof avatar === "string" && typeof content === "string") {
            res.send('{result: "ok", error: null}');
            nodecg.Replicant("chat").value = { name, avatar, content };
        } else {
            res.send('{result: "ng", "error": "Invaild type"}');
        }
    });
    router.post("/vc", (req, res) => {
		const { members } = req.body;
        if (typeof members === "object") {
            res.send('{result: "ok", error: null}');
            nodecg.Replicant("vc").value = members;
        } else {
            res.send('{result: "ng", "error": "Invaild type"}');
        }
    });
}