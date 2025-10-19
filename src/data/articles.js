export const articles = [
  {
    id: 1,
    title: "What is Artificial Intelligence?",
    slug: "what-is-artificial-intelligence",
    excerpt: "A comprehensive introduction to Artificial Intelligence, exploring its definition, history, applications, and impact on our daily lives.",
    content: `
      <h2>Introduction</h2>
      <p>Artificial Intelligence (AI) is the simulation of human intelligence processes by machines, especially computer systems. These processes include learning, reasoning, and self-correction.</p>

      <h2>History of AI</h2>
      <p>The concept of AI dates back to the 1950s when Alan Turing asked the question "Can machines think?" Since then, AI has evolved from simple rule-based systems to sophisticated neural networks that can recognize patterns, understand language, and make decisions.</p>

      <h2>Types of AI</h2>
      <h3>Narrow AI (Weak AI)</h3>
      <p>Designed to perform a specific task, such as voice recognition or image classification. This is what we commonly see today in applications like Siri, Alexa, and recommendation systems.</p>

      <h3>General AI (Strong AI)</h3>
      <p>Hypothetical AI that can understand, learn, and apply knowledge across different domains, similar to human intelligence. This level of AI doesn't exist yet.</p>

      <h3>Superintelligent AI</h3>
      <p>A theoretical form of AI that surpasses human intelligence in all aspects. This remains in the realm of science fiction.</p>

      <h2>Applications of AI</h2>
      <ul>
        <li>Healthcare: Disease diagnosis, drug discovery, personalized treatment</li>
        <li>Finance: Fraud detection, algorithmic trading, risk assessment</li>
        <li>Transportation: Self-driving cars, traffic management, logistics optimization</li>
        <li>Entertainment: Content recommendation, game AI, creative tools</li>
        <li>Education: Personalized learning, automated grading, intelligent tutoring</li>
      </ul>

      <h2>The Future of AI</h2>
      <p>AI continues to advance rapidly, with breakthroughs in deep learning, natural language processing, and computer vision. As AI becomes more integrated into our lives, understanding its capabilities and limitations becomes increasingly important.</p>
    `,
    category: "Fundamentals",
    readTime: 10,
    date: "2025-10-19",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop",
    featured: true
  },
  {
    id: 2,
    title: "Introduction to Machine Learning: A Beginner's Guide",
    slug: "introduction-to-machine-learning",
    excerpt: "Discover the fundamentals of machine learning, from supervised learning to neural networks. This comprehensive guide will help you understand the core concepts.",
    content: `
      <h2>What is Machine Learning?</h2>
      <p>Machine Learning is a subset of artificial intelligence that enables systems to learn and improve from experience without being explicitly programmed.</p>

      <h2>Types of Machine Learning</h2>
      <h3>Supervised Learning</h3>
      <p>In supervised learning, the model learns from labeled training data and makes predictions based on that data.</p>

      <h3>Unsupervised Learning</h3>
      <p>Unsupervised learning finds hidden patterns in data without pre-existing labels.</p>

      <h3>Reinforcement Learning</h3>
      <p>This type of learning uses rewards and penalties to train models to make sequences of decisions.</p>

      <h2>Getting Started</h2>
      <p>The best way to start with machine learning is to understand the mathematical foundations and practice with real datasets.</p>
    `,
    category: "Fundamentals",
    readTime: 8,
    date: "2025-01-15",
    image: "https://images.unsplash.com/photo-1555255707-c07966088b7b?w=800&h=400&fit=crop",
    featured: false
  },
  {
    id: 3,
    title: "Understanding Transformers: The Architecture Behind ChatGPT",
    slug: "understanding-transformers-architecture",
    excerpt: "Deep dive into the transformer architecture that revolutionized natural language processing and powers modern AI systems like ChatGPT.",
    content: `
      <h2>The Transformer Revolution</h2>
      <p>The transformer architecture, introduced in the paper "Attention is All You Need", fundamentally changed how we approach NLP tasks.</p>

      <h2>Self-Attention Mechanism</h2>
      <p>The core innovation of transformers is the self-attention mechanism, which allows the model to weigh the importance of different words in a sequence.</p>

      <h2>Key Components</h2>
      <ul>
        <li>Multi-head attention</li>
        <li>Positional encoding</li>
        <li>Feed-forward networks</li>
        <li>Layer normalization</li>
      </ul>

      <h2>Applications</h2>
      <p>Transformers power modern language models, translation systems, and even image generation models.</p>
    `,
    category: "Deep Learning",
    readTime: 12,
    date: "2025-01-10",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop",
    featured: false
  },
  {
    id: 4,
    title: "Ethical AI: Building Responsible Machine Learning Systems",
    slug: "ethical-ai-responsible-ml",
    excerpt: "Explore the critical considerations for building fair, transparent, and accountable AI systems in today's world.",
    content: `
      <h2>Why Ethics Matter in AI</h2>
      <p>As AI systems become more prevalent in decision-making processes, ensuring they operate ethically is crucial.</p>

      <h2>Key Ethical Considerations</h2>
      <h3>Bias and Fairness</h3>
      <p>AI systems can perpetuate or amplify existing biases in training data. We must actively work to identify and mitigate these biases.</p>

      <h3>Transparency</h3>
      <p>Users should understand how AI systems make decisions that affect them.</p>

      <h3>Privacy</h3>
      <p>Protecting user data and ensuring AI systems respect privacy is fundamental.</p>

      <h2>Best Practices</h2>
      <p>Implement diverse teams, regular audits, and clear documentation of AI system limitations.</p>
    `,
    category: "Ethics",
    readTime: 10,
    date: "2025-01-08",
    image: "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=800&h=400&fit=crop",
    featured: false
  },
  {
    id: 5,
    title: "Getting Started with PyTorch: A Practical Tutorial",
    slug: "getting-started-pytorch-tutorial",
    excerpt: "Learn how to build your first neural network using PyTorch, one of the most popular deep learning frameworks.",
    content: `
      <h2>What is PyTorch?</h2>
      <p>PyTorch is an open-source machine learning library developed by Facebook's AI Research lab.</p>

      <h2>Installing PyTorch</h2>
      <pre><code>pip install torch torchvision</code></pre>

      <h2>Building Your First Model</h2>
      <pre><code>import torch
import torch.nn as nn

class SimpleNet(nn.Module):
    def __init__(self):
        super(SimpleNet, self).__init__()
        self.fc1 = nn.Linear(784, 128)
        self.fc2 = nn.Linear(128, 10)

    def forward(self, x):
        x = torch.relu(self.fc1(x))
        x = self.fc2(x)
        return x</code></pre>

      <h2>Training the Model</h2>
      <p>Use dataloaders, loss functions, and optimizers to train your neural network.</p>
    `,
    category: "Tutorials",
    readTime: 15,
    date: "2025-01-05",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&h=400&fit=crop",
    featured: false
  },
  {
    id: 6,
    title: "Computer Vision Basics: From Pixels to Object Detection",
    slug: "computer-vision-basics",
    excerpt: "An introduction to computer vision techniques, from image preprocessing to modern object detection algorithms.",
    content: `
      <h2>Introduction to Computer Vision</h2>
      <p>Computer vision enables machines to interpret and understand visual information from the world.</p>

      <h2>Image Processing Fundamentals</h2>
      <p>Learn about image representation, filtering, edge detection, and feature extraction.</p>

      <h2>Convolutional Neural Networks</h2>
      <p>CNNs are the backbone of modern computer vision, learning hierarchical features from images.</p>

      <h2>Object Detection</h2>
      <p>Modern approaches like YOLO and Faster R-CNN can detect and localize multiple objects in real-time.</p>

      <h2>Applications</h2>
      <ul>
        <li>Autonomous vehicles</li>
        <li>Medical imaging</li>
        <li>Facial recognition</li>
        <li>Quality control in manufacturing</li>
      </ul>
    `,
    category: "Computer Vision",
    readTime: 11,
    date: "2025-01-03",
    image: "https://images.unsplash.com/photo-1535378917042-10a22c95931a?w=800&h=400&fit=crop",
    featured: false
  },
  {
    id: 7,
    title: "The Future of AI: Trends to Watch in 2025",
    slug: "future-of-ai-2025-trends",
    excerpt: "Explore the emerging trends and technologies shaping the future of artificial intelligence in 2025 and beyond.",
    content: `
      <h2>AI Trends for 2025</h2>
      <p>The AI landscape continues to evolve rapidly. Here are the key trends to watch.</p>

      <h2>Multimodal AI</h2>
      <p>Models that can process and understand multiple types of data - text, images, audio, and video - simultaneously.</p>

      <h2>Edge AI</h2>
      <p>Running AI models on edge devices for faster, more private processing without cloud dependency.</p>

      <h2>AI Agents</h2>
      <p>Autonomous agents that can plan, reason, and execute complex tasks with minimal human intervention.</p>

      <h2>Sustainable AI</h2>
      <p>Focus on reducing the environmental impact of training and running large AI models.</p>
    `,
    category: "News & Trends",
    readTime: 9,
    date: "2025-01-01",
    image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&h=400&fit=crop",
    featured: false
  }
];

export const categories = [
  { name: "Fundamentals", color: "#3B82F6" },
  { name: "Deep Learning", color: "#8B5CF6" },
  { name: "NLP", color: "#EC4899" },
  { name: "Computer Vision", color: "#10B981" },
  { name: "Ethics", color: "#F59E0B" },
  { name: "Tutorials", color: "#06B6D4" },
  { name: "News & Trends", color: "#EF4444" }
];
