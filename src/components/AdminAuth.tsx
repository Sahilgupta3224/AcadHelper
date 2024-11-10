import { useStore } from "@/store";
import { useRouter } from "next/router";
import { useEffect } from "react";

export const AdminAuth = (Component: React.FC) => {
  return (props: any) => {
    const { user } = useStore();
    const router = useRouter();
    useEffect(() => {
        const courseId = router.query.id as string;
        const hasAccess = user && courseId && user.CoursesAsAdmin.some((adminCourseId) => adminCourseId.toString() === courseId);
        if (!hasAccess && courseId) {
            router.replace("/unauthorized");
          }
    }, [user, router.query.id]);

    return user && user.CoursesAsAdmin.includes(router.query.id as string) ? (
      <Component {...props} />
    ) : null;
  };
};
