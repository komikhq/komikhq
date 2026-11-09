import { useParams } from "react-router";
import { AdminComicDetailView } from "@/components/admin/chapters/admin-comic-detail-view";

export default function DashboardComicDetailRoute() {
  const { id } = useParams();
  return <AdminComicDetailView comicId={id || ""} />;
}

