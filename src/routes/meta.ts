/*
 * tiktxk - Open Source, Privacy First TikTok Embeds
 * Copyright (C) 2022 Britmoji
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import { Hono } from "hono";
import { tiktok } from "@/util/tiktok";
import { StatusError } from "@/types/cloudflare";

export const addMetaRoutes = (app: Hono) => {
  // Video metadata
  app.get("/meta/:videoId/video", async (c) => {
    const videoId = c.req.param("videoId");
    const details = await tiktok.details(videoId);
    if (!details) throw new StatusError(404);

    const urls = details.aweme_details[0].video?.play_addr.url_list;
    if (!urls) throw new StatusError(404);
    return c.redirect(urls[urls.length - 1]);
  });

  // Image metadata
  app.get("/meta/:videoId/image", async (c) => {
    const videoId = c.req.param("videoId");
    const details = await tiktok.details(videoId);
    if (!details) throw new StatusError(404);

    // Use the image or default to the video
    const urls =
      details.aweme_details[0].image_post_info?.images[0]?.display_image
        ?.url_list || details.aweme_details[0].video?.cover?.url_list;

    if (!urls) throw new StatusError(404);
    return c.redirect(urls[0]);
  });

  // Thumbnail metadata
  app.get("/meta/:videoId/thumbnail", async (c) => {
    const videoId = c.req.param("videoId");
    const details = await tiktok.details(videoId);
    if (!details) throw new StatusError(404);

    const video = details.aweme_details[0].video?.cover.url_list[0];
    if (!video) throw new StatusError(404);
    return c.redirect(video);
  });

  // Audio metadata
  app.get("/meta/:videoId/audio", async (c) => {
    const videoId = c.req.param("videoId");
    const details = await tiktok.details(videoId);
    if (!details) throw new StatusError(404);

    return c.redirect(details.aweme_details[0].music.play_url.url_list[0]);
  });

  // All metadata
  app.get("/meta/:videoId", async (c) => {
    const videoId = c.req.param("videoId");
    const details = await tiktok.details(videoId);
    if (!details) throw new StatusError(404);

    return c.json(details);
  });
};
