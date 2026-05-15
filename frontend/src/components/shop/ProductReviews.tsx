import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ThumbsUp, ChevronDown, ChevronUp, ImagePlus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface Review {
  id: string;
  userName: string;
  rating: number;
  date: Date;
  title: string;
  comment: string;
  helpful: number;
  verified: boolean;
  images?: string[];
}

interface ProductReviewsProps {
  productId: number;
  productName: string;
  averageRating: number;
}

// Mock reviews data
const generateMockReviews = (productId: number): Review[] => [
  {
    id: "1",
    userName: "Priya S.",
    rating: 5,
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    title: "Excellent quality!",
    comment: "Amazing product! The fabric quality is top-notch and fits perfectly. Will definitely buy more from RASU.",
    helpful: 24,
    verified: true,
    images: [
      "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=200&h=200&fit=crop",
      "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=200&h=200&fit=crop",
    ],
  },
  {
    id: "2",
    userName: "Rahul M.",
    rating: 4,
    date: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
    title: "Great purchase",
    comment: "Good quality for the price. Delivery was quick and packaging was neat. Only giving 4 stars because the color was slightly different from the image.",
    helpful: 18,
    verified: true,
    images: [],
  },
  {
    id: "3",
    userName: "Ananya K.",
    rating: 5,
    date: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
    title: "Love it!",
    comment: "Perfect fit and very comfortable. I've received so many compliments wearing this. Highly recommend!",
    helpful: 12,
    verified: true,
    images: [
      "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=200&h=200&fit=crop",
    ],
  },
  {
    id: "4",
    userName: "Vikram J.",
    rating: 3,
    date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    title: "Decent product",
    comment: "The product is okay, but I expected better quality at this price point. Sizing runs a bit small.",
    helpful: 8,
    verified: false,
    images: [],
  },
  {
    id: "5",
    userName: "Sneha R.",
    rating: 5,
    date: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
    title: "Worth every rupee",
    comment: "Absolutely love this! The material feels premium and it looks exactly like the pictures. Fast shipping too!",
    helpful: 31,
    verified: true,
    images: [],
  },
];

const ProductReviews = ({ productId, productName, averageRating }: ProductReviewsProps) => {
  const [reviews, setReviews] = useState<Review[]>(generateMockReviews(productId));
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 0,
    title: "",
    comment: "",
    name: "",
  });
  const [hoverRating, setHoverRating] = useState(0);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [imagePreviewOpen, setImagePreviewOpen] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const totalReviews = reviews.length;
  const ratingCounts = [5, 4, 3, 2, 1].map(
    (rating) => reviews.filter((r) => r.rating === rating).length
  );

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(date);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    if (uploadedImages.length + files.length > 5) {
      toast.error("You can upload up to 5 images");
      return;
    }

    Array.from(files).forEach((file) => {
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload only image files");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setUploadedImages((prev) => [...prev, event.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeImage = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmitReview = () => {
    if (newReview.rating === 0) {
      toast.error("Please select a rating");
      return;
    }
    if (!newReview.title.trim() || !newReview.comment.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    const review: Review = {
      id: Date.now().toString(),
      userName: newReview.name || "Anonymous",
      rating: newReview.rating,
      date: new Date(),
      title: newReview.title,
      comment: newReview.comment,
      helpful: 0,
      verified: false,
      images: uploadedImages,
    };

    setReviews([review, ...reviews]);
    setNewReview({ rating: 0, title: "", comment: "", name: "" });
    setUploadedImages([]);
    setDialogOpen(false);
    toast.success("Review submitted successfully!");
  };

  const handleHelpful = (reviewId: string) => {
    setReviews(
      reviews.map((r) =>
        r.id === reviewId ? { ...r, helpful: r.helpful + 1 } : r
      )
    );
    toast.success("Thanks for your feedback!");
  };

  const displayedReviews = showAllReviews ? reviews : reviews.slice(0, 3);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-2xl font-bold">Customer Reviews</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>Write a Review</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Write a Review</DialogTitle>
              <DialogDescription>
                Share your experience with {productName}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              {/* Star Rating */}
              <div className="space-y-2">
                <Label>Your Rating</Label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewReview({ ...newReview, rating: star })}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="p-1 transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-8 h-8 ${
                          star <= (hoverRating || newReview.rating)
                            ? "fill-accent text-accent"
                            : "text-muted-foreground/30"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="review-name">Your Name (optional)</Label>
                <Input
                  id="review-name"
                  placeholder="John Doe"
                  value={newReview.name}
                  onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                />
              </div>

              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="review-title">Review Title</Label>
                <Input
                  id="review-title"
                  placeholder="Sum up your experience"
                  value={newReview.title}
                  onChange={(e) => setNewReview({ ...newReview, title: e.target.value })}
                />
              </div>

              {/* Comment */}
              <div className="space-y-2">
                <Label htmlFor="review-comment">Your Review</Label>
                <Textarea
                  id="review-comment"
                  placeholder="What did you like or dislike about this product?"
                  rows={4}
                  value={newReview.comment}
                  onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                />
              </div>

              {/* Image Upload */}
              <div className="space-y-2">
                <Label>Add Photos (optional)</Label>
                <div className="flex flex-wrap gap-2">
                  {uploadedImages.map((img, index) => (
                    <div key={index} className="relative w-16 h-16 rounded-lg overflow-hidden group">
                      <img loading="lazy"
                        src={img}
                        alt={`Upload ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4 text-white" />
                      </button>
                    </div>
                  ))}
                  {uploadedImages.length < 5 && (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-16 h-16 rounded-lg border-2 border-dashed border-muted-foreground/30 flex items-center justify-center hover:border-primary hover:bg-primary/5 transition-colors"
                    >
                      <ImagePlus className="w-5 h-5 text-muted-foreground" />
                    </button>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <p className="text-xs text-muted-foreground">
                  Up to 5 images, max 5MB each
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmitReview}>Submit Review</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Rating Summary */}
      <div className="grid gap-8 md:grid-cols-[200px,1fr]">
        {/* Overall Rating */}
        <div className="text-center md:text-left">
          <div className="text-5xl font-bold mb-2">{averageRating.toFixed(1)}</div>
          <div className="flex justify-center md:justify-start gap-1 mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-5 h-5 ${
                  star <= Math.round(averageRating)
                    ? "fill-accent text-accent"
                    : "text-muted-foreground/30"
                }`}
              />
            ))}
          </div>
          <p className="text-sm text-muted-foreground">
            Based on {totalReviews} reviews
          </p>
        </div>

        {/* Rating Breakdown */}
        <div className="space-y-2">
          {[5, 4, 3, 2, 1].map((rating, index) => (
            <div key={rating} className="flex items-center gap-3">
              <span className="text-sm w-12 flex items-center gap-1">
                {rating} <Star className="w-3 h-3 fill-current" />
              </span>
              <Progress
                value={(ratingCounts[index] / totalReviews) * 100}
                className="h-2 flex-1"
              />
              <span className="text-sm text-muted-foreground w-8">
                {ratingCounts[index]}
              </span>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Reviews List */}
      <div className="space-y-6">
        <AnimatePresence>
          {displayedReviews.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.05 }}
              className="border-b border-border pb-6 last:border-0"
            >
              <div className="flex items-start gap-4">
                <Avatar className="w-10 h-10">
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {review.userName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{review.userName}</span>
                      {review.verified && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/10 text-green-500">
                          Verified Purchase
                        </span>
                      )}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {formatDate(review.date)}
                    </span>
                  </div>

                  <div className="flex gap-1 mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          star <= review.rating
                            ? "fill-accent text-accent"
                            : "text-muted-foreground/30"
                        }`}
                      />
                    ))}
                  </div>

                  <h4 className="font-medium mb-1">{review.title}</h4>
                  <p className="text-muted-foreground text-sm mb-3">
                    {review.comment}
                  </p>

                  {/* Review Images */}
                  {review.images && review.images.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {review.images.map((img, imgIndex) => (
                        <button
                          key={imgIndex}
                          onClick={() => setImagePreviewOpen(img)}
                          className="w-16 h-16 rounded-lg overflow-hidden hover:opacity-80 transition-opacity"
                        >
                          <img loading="lazy"
                            src={img}
                            alt={`Review image ${imgIndex + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}

                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground h-8 px-2"
                    onClick={() => handleHelpful(review.id)}
                  >
                    <ThumbsUp className="w-4 h-4 mr-1" />
                    Helpful ({review.helpful})
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Show More/Less */}
      {reviews.length > 3 && (
        <div className="text-center">
          <Button
            variant="outline"
            onClick={() => setShowAllReviews(!showAllReviews)}
            className="gap-2"
          >
            {showAllReviews ? (
              <>
                Show Less <ChevronUp className="w-4 h-4" />
              </>
            ) : (
              <>
                Show All {reviews.length} Reviews <ChevronDown className="w-4 h-4" />
              </>
            )}
          </Button>
        </div>
      )}

      {/* Image Preview Dialog */}
      <Dialog open={!!imagePreviewOpen} onOpenChange={() => setImagePreviewOpen(null)}>
        <DialogContent className="sm:max-w-2xl p-2">
          {imagePreviewOpen && (
            <img loading="lazy"
              src={imagePreviewOpen}
              alt="Review image preview"
              className="w-full h-auto rounded-lg"
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductReviews;
