import { createFileRoute } from '@tanstack/react-router'
import { EditorProvider, FloatingMenu, BubbleMenu, useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Highlight from '@tiptap/extension-highlight'
import Typography from '@tiptap/extension-typography'

export const Route = createFileRoute('/(app)/_layout/')({
  component: Index,
})

const extensions = [StarterKit, Typography, Link, Highlight]

const content = `
  <h1>John Doe</h1>
  <h5>Software Engineer</h5>
  <p><a href="https://linkedin.com/in/johndoe">LinkedIn</a> | <a href="https://github.com/johndoe">GitHub</a> | john.doe@example.com | (123) 456-7890 | San Francisco, CA</p>

  <h2>Experience</h2>
  <h3>Software Engineer</h3>
  <h5><strong>Tech Solutions Inc.</strong> | San Francisco, CA | <em>Jan 2020 - Present</em></h5>
  <ul>
      <li>Developed scalable microservices architecture for a cloud-based SaaS application, improving system performance by 40%.</li>
      <li>Led the migration of a legacy monolithic application to a modern cloud-based architecture, reducing downtime by 25%.</li>
      <li>Implemented CI/CD pipelines using Jenkins and Docker, accelerating deployment cycles by 30%.</li>
      <li>Collaborated with UX designers to build a React-based front-end, enhancing user engagement by 15%.</li>
  </ul>
  <h3>Junior Software Engineer</h3>
  <h5><strong>Innovatech Ltd.</strong> | Palo Alto, CA | <em>Jun 2017 - Dec 2019</em></h5>
  <ul>
      <li>Wrote clean, maintainable, and testable code for internal tools, saving 200+ engineering hours annually.</li>
      <li>Optimized database queries and caching mechanisms, reducing API response time by 50%.</li>
      <li>Contributed to the development of a chatbot using Python and NLP libraries, improving customer service response times.</li>
      <li>Participated in daily stand-ups and sprint planning meetings as part of the Agile workflow.</li>
  </ul>

  <h2>Technical Skills</h2>
  <ul>
    <li><strong>Languages:</strong> Python, JavaScript, Java, C++</li>
    <li><strong>Frameworks & Libraries:</strong> React, Node.js, Django, Spring Boot</li>
    <li><strong>Tools & Platforms:</strong> AWS, Docker, Kubernetes, Jenkins, Git</li>
    <li><strong>Databases:</strong> PostgreSQL, MongoDB, MySQL</li>
    <li><strong>Other:</strong> RESTful APIs, Agile/Scrum, Test-Driven Development (TDD)</li>
  </ul>

  <h2>Education</h2>
  <h3>Bachelor of Science in Computer Science</h3>
  <h5><strong>University of California, Berkeley</strong> | Berkeley, CA | <em>Graduated May 2017</em></h5>
  <ul>
      <li>GPA: 3.8/4.0</li>
      <li>Relevant Coursework: Data Structures & Algorithms, Software Engineering, Machine Learning, Database Systems</li>
  </ul>

  <h2>Projects</h2>
  <h3>E-Commerce Platform</h3>
  <ul>
      <li>Built a full-stack e-commerce platform using React, Node.js, and MongoDB, handling 10,000+ concurrent users.</li>
      <li>Integrated Stripe API for secure payment processing and real-time order tracking.</li>
  </ul>
  <h3>Real-Time Chat Application</h3>
  <ul>
      <li>Designed and implemented a chat application with WebSocket for real-time communication.</li>
      <li>Deployed on AWS, ensuring 99.99% uptime with auto-scaling capabilities.</li>
  </ul>

  <h2>Certifications</h2>
  <ul>
      <li>AWS Certified Solutions Architect - Associate</li>
      <li>Certified Kubernetes Administrator (CKA)</li>
  </ul>
`

function Index() {
  const editor = useEditor({
    extensions,
    content,
  })

  return (
    <div className="w-full min-h-screen">
      <div className='h-full max-w-4xl min-h-screen py-24 mx-auto print:py-0'>
        <div className='font-serif prose print:prose-xs print:prose-li:my-0 max-w-none'>
          <EditorContent editor={editor} className="editor"  />
          {/* <FloatingMenu editor={editor}>This is the floating menu</FloatingMenu>
        <BubbleMenu editor={editor}>This is the bubble menu</BubbleMenu> */}
        </div>


      </div>
    </div>
  )
}
