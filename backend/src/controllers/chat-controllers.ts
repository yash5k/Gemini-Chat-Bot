import { NextFunction, Request, Response } from "express";
import User from "../models/User.js";
import { configureGemini } from "../config/gemini-config.js";

export const generateChatCompletion = async (
  req: Request,
  res: Response,
  next: NextFunction
) => { 
    const { message } = req.body;
    try {
    const user=await User.findById(res.locals.jwtData.id);
      if (!user)
      return res
        .status(401)
        .json({ message: "User not registered OR Token malfunctioned" });
           // grab chats of user
    const chats = user.chats.map(({ role, content }) => ({
      role,
      content,
    }));
    chats.push({ content: message, role: "user" });
    user.chats.push({ content: message, role: "user" });

    // Gemini modelini seçelim
    const genAI = configureGemini();
    // check_models.js çıktısına göre 'gemini-2.5-flash' modelini kullanıyoruz
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    
    // Convert chat history to Gemini format
    const history = chats.slice(0, -1).map(chat => ({
      role: chat.role === "user" ? "user" : "model",
      parts: [{ text: chat.content || " " }],
    }));
    
    console.log("--- GEMINI ISTEGI GONDERILIYOR ---");
    const chat = model.startChat({ history });
    const result = await chat.sendMessage(message);
    const response = result.response.text();
    
    user.chats.push({ content: response, role: "assistant" });
    await user.save();
    return res.status(200).json({ chats: user.chats });
  } catch (error) {
    console.log("!!! GEMINI HATASI !!!");

    // Hata detaylarını daha iyi yakalayalım
    // @ts-ignore - SDK hata tipleri net değil
    const anyErr: any = error;
    const status = anyErr.status || anyErr.response?.status;
    const data = anyErr.response?.data;

    if (status === 429 || anyErr.message?.includes("429")) {
      return res.status(429).json({
        message:
          "Gemini API kotası doldu (Too Many Requests). Lütfen 15-30 saniye bekleyip tekrar deneyin.",
      });
    }

    console.log(
      "Gemini error raw:",
      JSON.stringify({ status, data, message: anyErr.message }, null, 2)
    );

    return res.status(500).json({
      message: "Gemini API Hatası",
      cause: anyErr.message,
      status,
      data,
    });
  }
};  
export const sendChatsToUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    //user token check
    const user = await User.findById(res.locals.jwtData.id);
    if (!user) {
      return res.status(401).send("User not registered OR Token malfunctioned");
    }
    if (user._id.toString() !== res.locals.jwtData.id) {
      return res.status(401).send("Permissions didn't match");
    }
    return res.status(200).json({ message: "OK", chats: user.chats });
  } catch (error) {
    console.log(error);
    return res.status(200).json({ message: "ERROR", cause: error.message });
  }
};

export const deleteChats = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    //user token check
    const user = await User.findById(res.locals.jwtData.id);
    if (!user) {
      return res.status(401).send("User not registered OR Token malfunctioned");
    }
    if (user._id.toString() !== res.locals.jwtData.id) {
      return res.status(401).send("Permissions didn't match");
    }
    //@ts-ignore
    user.chats = [];
    await user.save();
    return res.status(200).json({ message: "OK" });
  } catch (error) {
    console.log(error);
    return res.status(200).json({ message: "ERROR", cause: error.message });
  }
};