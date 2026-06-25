import { SkeletonGrid } from "@/components/ui/CardSkeleton"

// 6.1 Membuat Preloader Component
export default function Preloader() {
  return (
    <div className="w-full flex justify-center items-center py-12">
      <div className="w-full max-w-7xl mx-auto">
        <SkeletonGrid count={4} columns={4} />
      </div>
    </div>
  )
}
