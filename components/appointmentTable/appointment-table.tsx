
interface Appointment {
  _id: string;
  userId?: string;
  userName?: string;
  userEmail?: string;
  serviceId?: string;
  serviceName: string;
  serviceImage?: string;
  image?: string;
  category?: string;
  price: number;
  duration?: number;
  appointmentDate: string;
  appointmentTime: string;
  appointmentStatus?: string;
  status?: string;
  paymentStatus?: string;
  createdAt: string;
}

interface Props {
  appointments: Appointment[];
}

export default function AppointmentTable({
  appointments,
}: Props) {
  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="w-full min-w-900px text-sm">
        <thead className="bg-muted">
          <tr>
            <th className="p-4 text-left">Customer</th>
            <th className="p-4 text-left">Service</th>
            <th className="p-4 text-left">Date</th>
            <th className="p-4 text-left">Time</th>
            <th className="p-4 text-left">Price</th>
            <th className="p-4 text-left">Payment</th>
            <th className="p-4 text-left">Status</th>
          </tr>
        </thead>

        <tbody>
          {appointments.map((appointment) => (
            <tr
              key={appointment._id}
              className="border-t hover:bg-muted/30"
            >
              {/* Customer */}
              <td className="p-4">
                <p className="font-medium">
                  {appointment.userName || "N/A"}
                </p>
                <p className="text-muted-foreground">
                  {appointment.userEmail || "N/A"}
                </p>
              </td>

              {/* Service */}
              <td className="p-4">
                {appointment.serviceName}
              </td>

              {/* Date */}
              <td className="p-4 whitespace-nowrap">
                {appointment.appointmentDate}
              </td>

              {/* Time */}
              <td className="p-4 whitespace-nowrap">
                {appointment.appointmentTime}
              </td>

              {/* Price */}
              <td className="p-4 font-medium whitespace-nowrap">
                ৳{appointment.price}
              </td>

              {/* Payment */}
              <td className="p-4">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    appointment.paymentStatus === "paid"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {appointment.paymentStatus || "unpaid"}
                </span>
              </td>

              {/* Appointment Status */}
              <td className="p-4">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    appointment.status === "confirmed"
                      ? "bg-green-100 text-green-700"
                      : appointment.status === "cancelled"
                      ? "bg-red-100 text-red-700"
                      : appointment.status === "completed"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {appointment.status || "pending"}
                </span>
              </td>
            </tr>
          ))}

          {/* Empty State */}
          {appointments.length === 0 && (
            <tr>
              <td
                colSpan={7}
                className="p-8 text-center text-muted-foreground"
              >
                No appointments found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
