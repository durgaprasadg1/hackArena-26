"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function FoodRequestDialog({ open, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    locality: "",
    servingValue: "",
    servingUnit: "g",
    calories: "",
    protein: "",
    carbs: "",
    fat: "",
    fiber: "",
    sugar: "",
    sodium: "",
    potassium: "",
    calcium: "",
    iron: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "upload_preset",
      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "nutrisync",
    );
    formData.append(
      "cloud_name",
      process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    );

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        },
      );

      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error("Cloudinary upload error:", error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = "";

      // Upload image if provided
      if (imageFile) {
        setUploading(true);
        toast.loading("Uploading image...");
        imageUrl = await uploadToCloudinary(imageFile);
        toast.dismiss();
        setUploading(false);
      }

      // Prepare data
      const payload = {
        name: formData.name,
        locality: formData.locality,
        imageUrl,
        servingSize: {
          value: parseFloat(formData.servingValue),
          unit: formData.servingUnit,
        },
        nutrition: {
          calories: parseFloat(formData.calories) || 0,
          protein: parseFloat(formData.protein) || 0,
          carbs: parseFloat(formData.carbs) || 0,
          fat: parseFloat(formData.fat) || 0,
          fiber: parseFloat(formData.fiber) || 0,
          sugar: parseFloat(formData.sugar) || 0,
        },
        minerals: {
          sodium: parseFloat(formData.sodium) || 0,
          potassium: parseFloat(formData.potassium) || 0,
          calcium: parseFloat(formData.calcium) || 0,
          iron: parseFloat(formData.iron) || 0,
        },
      };

      const response = await fetch("/api/meals/food-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit request");
      }

      toast.success("Food request submitted!", {
        description: "You'll be notified once it's reviewed by our team.",
      });

      // Reset form
      setFormData({
        name: "",
        locality: "",
        servingValue: "",
        servingUnit: "g",
        calories: "",
        protein: "",
        carbs: "",
        fat: "",
        fiber: "",
        sugar: "",
        sodium: "",
        potassium: "",
        calcium: "",
        iron: "",
      });
      setImageFile(null);

      onSuccess && onSuccess();
      onClose();
    } catch (error) {
      console.error("Submit error:", error);
      toast.error("Failed to submit request", {
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Request New Food Item</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {/* Basic Info */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Food Name *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., Masala Dosa"
                required
              />
            </div>

            <div>
              <Label htmlFor="locality">Locality (Optional)</Label>
              <Input
                id="locality"
                name="locality"
                value={formData.locality}
                onChange={handleChange}
                placeholder="e.g., South India"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="servingValue">Serving Size *</Label>
                <Input
                  id="servingValue"
                  name="servingValue"
                  type="number"
                  step="0.1"
                  value={formData.servingValue}
                  onChange={handleChange}
                  placeholder="100"
                  required
                />
              </div>
              <div>
                <Label htmlFor="servingUnit">Unit *</Label>
                <select
                  id="servingUnit"
                  name="servingUnit"
                  value={formData.servingUnit}
                  onChange={handleChange}
                  className="w-full h-10 px-3 border rounded-md"
                >
                  <option value="g">grams (g)</option>
                  <option value="ml">milliliters (ml)</option>
                  <option value="oz">ounces (oz)</option>
                  <option value="cup">cup</option>
                  <option value="piece">piece</option>
                </select>
              </div>
            </div>

            <div>
              <Label htmlFor="image">Food Image (Optional)</Label>
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="cursor-pointer"
              />
            </div>
          </div>

          {/* Nutrition */}
          <div>
            <h3 className="font-semibold mb-3">Nutritional Information *</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="calories">Calories (kcal)</Label>
                <Input
                  id="calories"
                  name="calories"
                  type="number"
                  step="0.1"
                  value={formData.calories}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="protein">Protein (g)</Label>
                <Input
                  id="protein"
                  name="protein"
                  type="number"
                  step="0.1"
                  value={formData.protein}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="carbs">Carbs (g)</Label>
                <Input
                  id="carbs"
                  name="carbs"
                  type="number"
                  step="0.1"
                  value={formData.carbs}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="fat">Fat (g)</Label>
                <Input
                  id="fat"
                  name="fat"
                  type="number"
                  step="0.1"
                  value={formData.fat}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="fiber">Fiber (g)</Label>
                <Input
                  id="fiber"
                  name="fiber"
                  type="number"
                  step="0.1"
                  value={formData.fiber}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="sugar">Sugar (g)</Label>
                <Input
                  id="sugar"
                  name="sugar"
                  type="number"
                  step="0.1"
                  value={formData.sugar}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* Minerals (Optional) */}
          <div>
            <h3 className="font-semibold mb-3">Minerals (Optional)</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="sodium">Sodium (mg)</Label>
                <Input
                  id="sodium"
                  name="sodium"
                  type="number"
                  step="0.1"
                  value={formData.sodium}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="potassium">Potassium (mg)</Label>
                <Input
                  id="potassium"
                  name="potassium"
                  type="number"
                  step="0.1"
                  value={formData.potassium}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="calcium">Calcium (mg)</Label>
                <Input
                  id="calcium"
                  name="calcium"
                  type="number"
                  step="0.1"
                  value={formData.calcium}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="iron">Iron (mg)</Label>
                <Input
                  id="iron"
                  name="iron"
                  type="number"
                  step="0.1"
                  value={formData.iron}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              disabled={loading || uploading}
              className="flex-1"
            >
              {loading ? "Submitting..." : "Submit Request"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
