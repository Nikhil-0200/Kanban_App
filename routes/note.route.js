import express from "express";
import noteModel from "../models/note.model.js";
const noteRouter = express.Router();

noteRouter.post("/create", async (req, res) => {
  const { title, status, description } = req.body;
  const userId = req.user._id;

  try {
    const createNote = new noteModel({
      title,
      status,
      description,
      userId,
    });

    await createNote.save();
    res.status(200).json({ msg: `Note created successfully`, createNote });
  } catch (error) {
    res.status(404).json({ msg: `Error occured in creating note ${error}` });
  }
});

noteRouter.get("/", async (req, res) => {
  const userId = req.user._id;
  const { noteId, title, page = 1, limit = 2, sort = "createdAt" } = req.query;

  try {
    let query = { userId };

    //Filter by notesId if provided

    if (noteId) {
      const note = await noteModel.findOne({ _id: noteId, userId });
      if (!note) {
        return res.status(404).json({ msg: "Note not found" });
      }
      return res
        .status(200)
        .json({ msg: `Found note with ID: ${noteId}`, note });
    }

    //Filter by title

    if (title) {
      query.title = new RegExp(title, "i");
    }

    const notes = await noteModel
      .find(query)
      .limit(limit)
      .skip((page - 1) * limit)
      .exec();

    const totalNotes = await noteModel.countDocuments(query);

    res
      .status(200)
      .json({
        msg: `${req.user.userName} all notes`,
        notes,
        totalNotes,
        currentPage: page,
        totalPages: Math.ceil(totalNotes/limit)
      });
  } catch (error) {
    res.status(500).json({ msg: `Error in finding notes ${error}` });
  }
});

noteRouter.patch("/update/:id", async (req, res) => {
  const payload = req.body;
  const noteId = req.params.id;
  const userId = req.user._id;

  try {
    const note = await noteModel.findOne({ _id: noteId });

    if (note.userId.toString() === userId.toString()) {
      await noteModel.findByIdAndUpdate({ _id: noteId }, payload);
      return res.status(200).json({ msg: `Note updated successfully` });
    } else {
      return res.status(401).json({ msg: `Unauthorized` });
    }
  } catch (error) {
    return res.status(500).json({ msg: `Error while updating note, ${error}` });
  }
});

noteRouter.delete("/delete/:id", async (req, res) => {
  const noteId = req.params.id;
  const userId = req.user._id;

  try {
    const note = await noteModel.findOne({ _id: noteId });

    if (note.userId.toString() === userId.toString()) {
      await noteModel.findByIdAndDelete({ _id: noteId });
      return res.status(201).json({ msg: `Note has been deleted`, note });
    } else {
      return res.status(401).json({ msg: `Unauthorized` });
    }
  } catch (error) {
    res
      .status(500)
      .json({ msg: `Error occured while deleting note, ${error}` });
  }
});

export default noteRouter;
