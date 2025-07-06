import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../utils/utils";

function CourseCreate() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [videoLink, setVideoLink] = useState(""); // <-- new state
  const [image, setImage] = useState("");
  const [imagePreview, setImagePreview] = useState("");

  const navigate = useNavigate();

  const changePhotoHandler = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setImagePreview(reader.result);
      setImage(file);
    };
  };

  const handleCreateCourse = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("image", image);
    formData.append("videoLink", videoLink); // <-- append new field

    const admin = JSON.parse(localStorage.getItem("admin"));

    if (!admin || !admin.token) {
      toast.error("Please login as admin first.");
      navigate("/admin/login");
      return;
    }

    const token = admin.token;

    try {
      const response = await axios.post(
        `${BACKEND_URL}/course/create`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      toast.success(response.data.message || "Course created successfully");

      navigate("/admin/our-courses");

      // Reset form
      setTitle("");
      setDescription("");
      setPrice("");
      setVideoLink(""); // <-- reset this too
      setImage("");
      setImagePreview("");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.errors || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen py-10">
      <div className="max-w-4xl mx-auto p-6 border rounded-lg shadow-lg">
        <h3 className="text-2xl font-semibold mb-8">Create Course</h3>

        <form onSubmit={handleCreateCourse} className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <label className="block text-lg">Title</label>
            <input
              type="text"
              placeholder="Enter course title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-400 rounded-md outline-none"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="block text-lg">Description</label>
            <input
              type="text"
              placeholder="Enter course description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-400 rounded-md outline-none"
            />
          </div>

          {/* Price */}
          <div className="space-y-2">
            <label className="block text-lg">Price</label>
            <input
              type="number"
              placeholder="Enter course price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full px-3 py-2 border border-gray-400 rounded-md outline-none"
            />
          </div>

          {/* Video Link */}
          <div className="space-y-2">
            <label className="block text-lg">Video Link (YouTube / Vimeo)</label>
            <input
              type="text"
              placeholder="Enter video URL"
              value={videoLink}
              onChange={(e) => setVideoLink(e.target.value)}
              className="w-full px-3 py-2 border border-gray-400 rounded-md outline-none"
            />
          </div>

          {/* Course Image */}
          <div className="space-y-2">
            <label className="block text-lg">Course Image</label>
            <div className="flex items-center justify-center">
              <img
                src={imagePreview || "/imgPL.webp"}
                alt="Preview"
                className="w-full max-w-sm h-auto rounded-md object-cover"
              />
            </div>
            <input
              type="file"
              onChange={changePhotoHandler}
              className="w-full px-3 py-2 border border-gray-400 rounded-md outline-none"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-200"
          >
            Create Course
          </button>
        </form>
      </div>
    </div>
  );
}

export default CourseCreate;
