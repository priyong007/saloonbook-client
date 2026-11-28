
import AppointmentTable from "@/components/appointmentTable/appointment-table";
import { getMyAppointments } from "@/lib/api/appointment";
import { getSession } from "@/lib/core/server";
import { redirect } from "next/navigation";

export default async function AdminAppointmentsPage() {
  const session = await getSession();

  if (!session) {
    redirect("/sign-in");
  }

  if (session.user.role !== "admin") {
    redirect("/");
  }

  const data = await getMyAppointments(session.user.id);

  if (!data.success) {
    return <p>Failed to load appointments.</p>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">
          Manage Appointments
        </h1>

        <p className="text-muted-foreground">
          View and manage all customer bookings.
        </p>
      </div>

      <AppointmentTable appointments={data.result} />
    </div>
  );
}
