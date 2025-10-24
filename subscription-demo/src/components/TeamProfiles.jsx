import React from 'react';

const TeamProfiles = () => {
  const teamMembers = [
    {
      id: 1,
      name: "Alex Johnson",
      role: "Chief Executive Officer",
      bio: "15+ years in software development. Leads innovation and strategic direction at Webkit Solutions.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&h=200&q=80",
      linkedin: "#",
      twitter: "#"
    },
    {
      id: 2,
      name: "Sarah Williams",
      role: "Project Manager",
      bio: "10+ years managing software projects. Expert in agile methodologies and team leadership.",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&h=200&q=80",
      linkedin: "#",
      twitter: "#"
    },
    {
      id: 3,
      name: "Michael Chen",
      role: "Lead Developer",
      bio: "Full-stack developer with expertise in modern web technologies. Architect of our core solutions.",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&h=200&q=80",
      linkedin: "#",
      twitter: "#"
    }
  ];

  return (
    <div className="mt-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {teamMembers.map((member) => (
          <div 
            key={member.id} 
            className="bg-white rounded-xl shadow-lg overflow-hidden card-hover border border-gray-100 transition-transform duration-300 hover:scale-105"
          >
            <div className="p-6">
              <div className="flex items-center mb-4">
                <img 
                  className="h-16 w-16 object-cover rounded-full mr-4" 
                  src={member.image} 
                  alt={member.name} 
                />
                <div>
                  <h3 className="text-xl font-bold text-gray-800">{member.name}</h3>
                  <div className="text-sm text-[#071846] font-medium">{member.role}</div>
                </div>
              </div>
              
              <p className="text-gray-600 mt-4">{member.bio}</p>
              
              <div className="mt-6 flex space-x-4">
                <a href={member.linkedin} className="text-[#071846] hover:text-[#0a2263]">
                  <span className="sr-only">LinkedIn</span>
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                </a>
                <a href={member.twitter} className="text-[#071846] hover:text-[#0a2263]">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamProfiles;