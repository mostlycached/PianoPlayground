import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import path from "path";

export async function registerRoutes(app: Express): Promise<Server> {
  // Since this is a client-side only application, we just need to serve the static files
  // No API endpoints are needed for the piano soundboard

  // If we needed to serve audio files, we could add routes here
  // app.get('/api/audio/:note', (req, res) => {
  //   const note = req.params.note;
  //   const filePath = path.resolve(__dirname, `../audio/${note}.mp3`);
  //   res.sendFile(filePath);
  // });

  const httpServer = createServer(app);

  return httpServer;
}
