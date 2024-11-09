import { useStore } from "@/store";
import { useRouter } from "next/router";
import { useEffect } from "react";
import User from "@/models/userModel";
import Assignment from "@/models/assignmentModel";

export const AdminAssignmentAuth = (Component: React.FC) => {
  return (props: any) => {
    const { user } = useStore();
    const router = useRouter();
    console.log(router.query.id)
    console.log(user?.CoursesAsAdmin)
    useEffect(() => {
        const challengeId = router.query.id as string
        const challenge = Assignment.findById(challengeId)
        const CourseId = challenge?.Course
        const hasAccess = user && CourseId && user.CoursesAsAdmin.some((adminCourseId) => adminCourseId.toString() === CourseId);
        if (!hasAccess && CourseId) {
            router.replace("/unauthorized");
          }
    }, [user, router.query.id]);

    return user && user.CoursesAsAdmin.includes(router.query.id as string) ? (
      <Component {...props} />
    ) : null;
  };
};
