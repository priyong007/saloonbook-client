



const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"

export const getMyAppointments = async (userId: string) => {
  try {
    const url = `${BASE_URL}/my-appointments?userId=${encodeURIComponent(userId)}`

    console.log("Fetching appointments:", url)

    const response = await fetch(url, {
      method: "GET",
      cache: "no-store",
    })

    const data = await response.json()

    console.log("Appointment API Response:", data)

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch appointments")
    }

    return data
  } catch (error) {
    console.error("getMyAppointments error:", error)
    throw error
  }
}

export const getMyAppointmentsCount = async (userId: string) => {
  try {
    const url = `${BASE_URL}/appointments/count?userId=${encodeURIComponent(userId)}`

    const response = await fetch(url, {
      method: "GET",
      cache: "no-store",
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch appointments count")
    }

    return data
  } catch (error) {
    console.error("getMyAppointmentsCount error:", error)
    throw error
  }
}




// Cancel appointment
export const cancelAppointment = async (appointmentId: string) => {
  const response = await fetch(
    `${BASE_URL}/appointments/${appointmentId}/cancel`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
    }
  )

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || "Failed to cancel appointment")
  }

  return data
}







// export const BASE_URL =
//   process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"

// // Get all appointment
// export const getAppointments = async () => {
//   const res = await fetch(`${BASE_URL}/appointments`, {
//     cache: "no-store",
//   })

//   if (!res.ok) {
//     throw new Error("Failed to fetch services")
//   }

//   return res.json()
// }
