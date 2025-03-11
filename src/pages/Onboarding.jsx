import React, { useState } from "react";

const Onboarding = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [age, setAge] = useState("");
  const [location, setLocation] = useState("");

  const handleOnboarding = async (e) => {
    e.preventDefault();
    const userData = {
      firstName,
      lastName,
      age: parseInt(age, 10),
      location,
      folders: [],
      treatmentCounts: 0,
      folder: [],
      createdBy: user.email.address,
    };

    console.log(userData);
    const newUser = await createUser(userData);
    if (newUser) {
      navigate("/profile");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#13131a]">
      <div className="w-full max-w-md rounded-xl bg-[#1c1c24] p-8 shadow-lg">
        <h2 className="mb-2 text-center text-5xl font-bold text-white">🙏</h2>
        <h2 className="mb-6 text-center text-2xl font-bold text-white">
          Namaste, Let's Get Started
        </h2>
        <form onSubmit={handleOnboarding}>
          <div className="mb-4">
            <label
              htmlFor="firstName"
              className="mb-2 block text-sm text-gray-300"
            >
              First Name
            </label>
            <input
              id="firstName"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              className="w-full rounded-lg bg-neutral-900 px-4 py-3 text-neutral-400 focus:border-blue-600 focus:outline-none"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="lastName"
              className="mb-2 block text-sm text-gray-300"
            >
              Last Name
            </label>
            <input
              id="lastName"
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              className="w-full rounded-lg bg-neutral-900 px-4 py-3 text-neutral-400 focus:border-blue-600 focus:outline-none"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="age" className="mb-2 block text-sm text-gray-300">
              Age
            </label>
            <input
              id="age"
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              required
              className="w-full rounded-lg bg-neutral-900 px-4 py-3 text-neutral-400 focus:border-blue-600 focus:outline-none"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="location"
              className="mb-2 block text-sm text-gray-300"
            >
              Location
            </label>
            <input
              id="location"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
              className="w-full rounded-lg bg-neutral-900 px-4 py-3 text-neutral-400 focus:border-blue-600 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="mt-4 w-full rounded-lg bg-green-600 py-3 font-semibold text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            Get Started
          </button>
        </form>
      </div>
    </div>
  );
};

export default Onboarding;
