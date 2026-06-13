const TemplateTwo = ({ data }) => {

  return (
    <div className="bg-gray-900 text-white p-10 min-h-screen rounded-lg">

      <h1 className="text-5xl font-bold">
        {data.name || "Your Name"}
      </h1>

      {
  data.profileImage &&
  (
    <img
      src={data.profileImage}
      alt="profile"
      className="w-32 h-32 rounded-full object-cover mt-4 mb-4 border"
    />
  )
}

      <p className="mt-3">
        {data.email || "your@email.com"}
      </p>

      <p>
        {data.phone || "+91 XXXXX XXXXX"}
      </p>

      <hr className="my-6 border-gray-600" />

      <h2 className="text-3xl font-bold mb-3">
        Professional Summary
      </h2>

      <p>
        {data.summary ||
          "Summary appears here"}
      </p>

      <hr className="my-6 border-gray-600" />

      <h2 className="text-3xl font-bold mb-3">
        Education
      </h2>

      <p className="font-semibold">
        {data.education || "Your Degree"}
      </p>

      <p>
        {data.college || "Your College"}
      </p>

      <p>
        CGPA: {data.cgpa || "0.0"}
      </p>

           <hr className="my-6" />

<h2 className="text-2xl font-bold mb-4">
  Experience
</h2>

{
  data.experiences?.map(
    (experience, index) => (

      <div
        key={index}
        className="mb-5"
      >

        <h3 className="text-xl font-semibold">
          {experience.role || "Role"}
        </h3>

        <p className="font-medium">
          {experience.company || "Company"}
        </p>

        <p className="text-gray-500">
          {experience.duration || "Duration"}
        </p>

        <p className="mt-2">
          {
            experience.description ||
            "Experience description"
          }
        </p>

      </div>
    )
  )
}

      <hr className="my-6" />

<h2 className="text-2xl font-bold mb-4">
  Projects
</h2>

{
  data.projects?.map(
    (project, index) => (

      <div
        key={index}
        className="mb-5"
      >

        <h3 className="text-xl font-semibold">
          {project.title}
        </h3>

        <p className="text-gray-600">
          {project.tech}
        </p>

        <p className="mt-2">
          {project.description}
        </p>

      </div>
    )
  )
}

<hr className="my-6" />

<h2 className="text-2xl font-bold mb-4">
  Skills
</h2>

<div className="flex flex-wrap gap-3">

  {
    data.skills?.map(
      (skill, index) => (

        <span
          key={index}
          className="bg-gray-200 px-4 py-2 rounded-full"
        >
          {skill}
        </span>
      )
    )
  }

</div>
    </div>
  );
};

export default TemplateTwo;