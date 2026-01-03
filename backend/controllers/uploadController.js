export const uploadLogo = async (req, res) => {
    res.json({ url: req.file.path });
};

export const uploadDocument = async (req, res) => {
    res.json({ url: req.file.path });
};
