require(".env").config();
const express = require('express');
const mongoose = require("mongoose");
const User = require("./models/User");

const app=express();
const port=process.env.PORT||3000;
const cors= require("cors");
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log("Connected to MongoDB");
}).catch((error) => {
  console.error("MongoDB connection error:", error);
});

app.listen(port,"0.0.0.0", () => {
  console.log("Server is running on port 3000");
});


const Habit = require("./models/habit")  

//end points to create a habit in the backend
app.use((req, res, next) => {
  console.log("incoming request:",req.method, req.url);
  next();
});
app.post("/api/habits", async (req, res) => {
  try {
    const {title,color,repeatMode, days,reminder,notificationId,deviceId} = req.body;

    const newHabit = new Habit({
        title,
        color,
        repeatMode,
        days,
        reminder,
        notificationId,
        deviceId,
    })

     const savedHabit = await newHabit.save();
     res.status(200).json(savedHabit);

  } catch (error) {
    console.log("error creating habit", error);
    res.status(500).json({ error: "network error" });
  }
});

app.get("/api/habits", async (req, res) => {
  try {
    const habits = await Habit.find();
    res.status(200).json(habits);
  } catch (error) {
    res.status(500).json({ error: "network error" });
  }
});

app.get("/habitslist", async (req, res) => {
  try {
    const { deviceId } = req.query;
    const allhabits = await Habit.find({deviceId});
    res.status(200).json(allhabits);
  } catch (error) {
    console.log("fetch error",error);
    res.status(500).json({ error: "network error" });
  }
});

// completed habit end point
app.put("/habits/:habitId/completed", async (req, res) => {
  const habitId = req.params.habitId;
  const updatedCompletion = req.body.completed;
  try {
    const updatedHabit = await Habit.findByIdAndUpdate(
      habitId,
      { completed: updatedCompletion },
      { new: true }
    );
    if (!updatedHabit) {
      return res.status(404).json({ error: "Habit not found" });
    }
    res.status(200).json(updatedHabit);
  } catch (error) {
    res.status(500).json({ error: "network error" });
  }
});
// delete habit end point
app.delete("/habits/:habitId", async (req, res) => {
  try {
    const { habitId } = req.params;
    await Habit.findByIdAndDelete(habitId);
    res.status(200).json({ message: "Habit deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "network error" });
  }
});
 
// update habit end point
app.put("/habits/:habitId", async (req, res) => {
  try {
    const { habitId } = req.params;
    const updatedData = req.body;

    const updatedHabit = await Habit.findByIdAndUpdate(
      habitId,
      updatedData,
      { new: true }
    );

    if (!updatedHabit) {
      return res.status(404).json({ error: "Habit not found" });
    }

    res.status(200).json(updatedHabit);
  } catch (error) {
    res.status(500).json({ error: "Network error" });
  }
}); 
 
// archive habit end point
app.put("/habits/:habitId/archive", async (req, res) => {
  try {
    const { habitId } = req.params;

    const updatedHabit = await Habit.findByIdAndUpdate(
      habitId,
      { archived: true },
      { new: true }
    );

    res.status(200).json(updatedHabit);
  } catch (error) {
    res.status(500).json({ error: "network error" });
  }
});

// mark date end point
app.post("/habits/:habitId/mark",async (req, res) =>{
  try{
    const{ habitId } = req.params;
    const{ date } = req.body;
    const updateHabit = await Habit.findById(habitId);

    if(!updateHabit)return res.status(404).json({message:"habit not found"});

    updateHabit.markedDates=updateHabit.markedDates||{};
    updateHabit.markedDates[date]=true;
    await updateHabit.save();
    res.json({success:true,markedDates:updateHabit.markedDates});

    console.log("Marking date:", date);

  }
  catch(error){
    console.log("error marking date",error);
    res.status(500).json({message:"Server error"});
  }
});  

// get habit by id end point
app.get("/habits/:id", async (req, res) => {
  try {
    const habit = await Habit.findById(req.params.id);
    res.status(200).json(habit);
  } catch (error) {
    res.status(500).json({ error: "network error" });
  }
});

app.get("/leaderboard", async (req, res) => {
  try {
    console.log("Leaderboard endpoint hit");

    const habits = await Habit.find();

    let totalXP = 0;

    habits.forEach(habit => {
      if (habit.markedDates) {
        Object.values(habit.markedDates).forEach(value => {
          if (value === true) {
            totalXP += 10;
          }
        });
      }
    });

    console.log("Calculated XP:", totalXP);

    res.json([
      {
        _id: "1",
        name: "You",
        weeklyXP: totalXP
      }
    ]);

  } catch (error) {
    console.log("Error fetching leaderboard", error);
    res.status(500).json({ error: "network error" });
  }
});

// DELETE ALL HABITS
// ✅ FIRST
app.delete("/habits/reset", async (req, res) => {
  try {
    await Habit.deleteMany({});
    res.status(200).json({
      success: true,
      message: "All habits deleted",
    });
  } catch (error) {
    console.log("Reset error:", error);
    res.status(500).json({ error: "Failed to reset habits" });
  }
});
