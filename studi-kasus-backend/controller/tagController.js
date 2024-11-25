import Tag from '../models/tagModel.js';

export const createTag = async (req, res, next) => {
    try {
        const tag = new Tag({
            name: req.body.name
        });
        const newTag = await tag.save();
        res.status(201).json(newTag);
    } catch (error) {
        next(error);
    }
};

export const getTags = async (req, res, next) => {
    try {
        const tags = await Tag.find();
        res.json(tags);
    } catch (error) {
        next(error);
    }
};

export const getTagById = async (req, res, next) => {
    try {
        const tag = await Tag.findById(req.params.id);
        if (!tag) {
            return res.status(404).json({ error: 'Tag not found' });
        }
        res.json(tag);
    } catch (error) {
        next(error);
    }
};

export const updateTag = async (req, res, next) => {
    try {
        const tag = await Tag.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!tag) {
            return res.status(404).json({ error: 'Tag not found' });
        }
        res.json(tag);
    } catch (error) {
        next(error);
    }
};

export const deleteTag = async (req, res, next) => {
    try {
        const tag = await Tag.findByIdAndDelete(req.params.id);
        if (!tag) {
            return res.status(404).json({ error: 'Tag not found' });
        }
        res.json({ message: 'Tag deleted successfully' });
    } catch (error) {
        next(error);
    }
};
