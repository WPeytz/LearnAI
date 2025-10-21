export const quizzes = [
  {
    id: 1,
    title: "AI Fundamentals",
    description: "Test your understanding of basic artificial intelligence concepts and terminology.",
    difficulty: "Beginner",
    category: "Fundamentals",
    questions: [
      {
        id: 1,
        question: "What does AI stand for?",
        options: [
          "Automated Intelligence",
          "Artificial Intelligence",
          "Advanced Integration",
          "Algorithmic Innovation"
        ],
        correctAnswer: 1,
        explanation: "AI stands for Artificial Intelligence, which refers to the simulation of human intelligence processes by machines, especially computer systems."
      },
      {
        id: 2,
        question: "Which type of AI currently exists and is in use today?",
        options: [
          "Artificial General Intelligence (AGI)",
          "Superintelligent AI",
          "Narrow AI (Weak AI)",
          "Human-level AI"
        ],
        correctAnswer: 2,
        explanation: "Narrow AI (Weak AI) is the only type of AI that currently exists. It's designed to perform specific tasks like voice recognition, image classification, or playing chess, but cannot transfer knowledge to other domains."
      },
      {
        id: 3,
        question: "Who is considered the father of AI and proposed the famous 'Turing Test'?",
        options: [
          "John McCarthy",
          "Marvin Minsky",
          "Alan Turing",
          "Geoffrey Hinton"
        ],
        correctAnswer: 2,
        explanation: "Alan Turing proposed the Turing Test in 1950 as a measure of a machine's ability to exhibit intelligent behavior indistinguishable from a human. While John McCarthy coined the term 'Artificial Intelligence' in 1956, Turing is widely considered a founding father of AI."
      },
      {
        id: 4,
        question: "What is the primary difference between traditional programming and machine learning?",
        options: [
          "Machine learning is faster than traditional programming",
          "Machine learning learns from data, while traditional programming follows explicit instructions",
          "Traditional programming is more accurate",
          "There is no significant difference"
        ],
        correctAnswer: 1,
        explanation: "The key difference is that traditional programming requires explicit instructions for every scenario, while machine learning systems learn patterns from data and can improve their performance through experience."
      },
      {
        id: 5,
        question: "Which of the following is NOT a common application of AI today?",
        options: [
          "Facial recognition systems",
          "Email spam filters",
          "True artificial consciousness",
          "Recommendation systems on streaming platforms"
        ],
        correctAnswer: 2,
        explanation: "True artificial consciousness does not exist. Current AI applications include facial recognition, spam filtering, and recommendation systems, but these are examples of narrow AI that excel at specific tasks without possessing consciousness or general intelligence."
      }
    ]
  },
  {
    id: 2,
    title: "Machine Learning Basics",
    description: "Evaluate your knowledge of machine learning concepts, types, and applications.",
    difficulty: "Intermediate",
    category: "Machine Learning",
    questions: [
      {
        id: 1,
        question: "In supervised learning, what is required in the training data?",
        options: [
          "Only input features",
          "Both input features and labeled outputs",
          "Only output labels",
          "No data is required"
        ],
        correctAnswer: 1,
        explanation: "Supervised learning requires training data with both input features and labeled outputs (correct answers). The algorithm learns to map inputs to outputs by studying these examples."
      },
      {
        id: 2,
        question: "Which type of machine learning is used to train a robot to navigate a maze through trial and error?",
        options: [
          "Supervised Learning",
          "Unsupervised Learning",
          "Reinforcement Learning",
          "Transfer Learning"
        ],
        correctAnswer: 2,
        explanation: "Reinforcement Learning is used for tasks where an agent learns through trial and error, receiving rewards for good actions and penalties for bad ones. This is ideal for navigation tasks where the robot learns from experience."
      },
      {
        id: 3,
        question: "What is overfitting in machine learning?",
        options: [
          "When a model performs well on both training and test data",
          "When a model is too simple to capture patterns",
          "When a model memorizes training data but performs poorly on new data",
          "When a model trains too quickly"
        ],
        correctAnswer: 2,
        explanation: "Overfitting occurs when a model learns the training data too well, including noise and outliers, causing it to perform poorly on new, unseen data. The model essentially memorizes rather than generalizes."
      },
      {
        id: 4,
        question: "Which algorithm would you use to group customers into segments without predefined categories?",
        options: [
          "Linear Regression",
          "Decision Trees",
          "K-Means Clustering",
          "Random Forest"
        ],
        correctAnswer: 2,
        explanation: "K-Means Clustering is an unsupervised learning algorithm that groups data points into clusters without predefined labels. It's commonly used for customer segmentation, discovering natural groupings in data."
      },
      {
        id: 5,
        question: "What does 'accuracy' measure in a classification model?",
        options: [
          "How fast the model makes predictions",
          "The proportion of correct predictions out of all predictions",
          "How much memory the model uses",
          "The number of features in the model"
        ],
        correctAnswer: 1,
        explanation: "Accuracy measures the proportion of correct predictions (both true positives and true negatives) out of all predictions made. It's calculated as (Correct Predictions / Total Predictions)."
      }
    ]
  },
  {
    id: 3,
    title: "Deep Learning & Neural Networks",
    description: "Challenge yourself with questions about neural networks, deep learning architectures, and modern AI.",
    difficulty: "Advanced",
    category: "Deep Learning",
    questions: [
      {
        id: 1,
        question: "What is the primary purpose of the activation function in a neural network?",
        options: [
          "To speed up training",
          "To introduce non-linearity into the model",
          "To reduce memory usage",
          "To normalize the data"
        ],
        correctAnswer: 1,
        explanation: "Activation functions introduce non-linearity into neural networks, allowing them to learn complex patterns. Without activation functions, even deep networks would only be able to learn linear relationships, no matter how many layers they have."
      },
      {
        id: 2,
        question: "What architecture breakthrough enabled the success of modern language models like GPT and BERT?",
        options: [
          "Convolutional Neural Networks (CNNs)",
          "Recurrent Neural Networks (RNNs)",
          "Transformers",
          "Autoencoders"
        ],
        correctAnswer: 2,
        explanation: "Transformers, introduced in the 'Attention is All You Need' paper (2017), revolutionized natural language processing. Their self-attention mechanism allows them to process sequences more efficiently than RNNs and capture long-range dependencies better."
      },
      {
        id: 3,
        question: "What is backpropagation in neural networks?",
        options: [
          "A technique to prevent overfitting",
          "An algorithm for computing gradients to update network weights",
          "A method for data preprocessing",
          "A way to visualize neural networks"
        ],
        correctAnswer: 1,
        explanation: "Backpropagation is the algorithm used to calculate gradients of the loss function with respect to network weights. These gradients are then used to update the weights through gradient descent, enabling the network to learn."
      },
      {
        id: 4,
        question: "Which type of neural network architecture is best suited for image recognition tasks?",
        options: [
          "Recurrent Neural Networks (RNNs)",
          "Convolutional Neural Networks (CNNs)",
          "Long Short-Term Memory networks (LSTMs)",
          "Generative Adversarial Networks (GANs)"
        ],
        correctAnswer: 1,
        explanation: "Convolutional Neural Networks (CNNs) are specifically designed for processing grid-like data such as images. They use convolutional layers to automatically learn hierarchical features like edges, shapes, and complex objects."
      },
      {
        id: 5,
        question: "What problem does the 'vanishing gradient' refer to in deep neural networks?",
        options: [
          "Gradients becoming too large during training",
          "Gradients becoming very small, making it hard to train deep networks",
          "Loss function reaching zero too quickly",
          "Data disappearing during preprocessing"
        ],
        correctAnswer: 1,
        explanation: "The vanishing gradient problem occurs when gradients become extremely small as they're propagated back through many layers, making it difficult to update weights in early layers. This was a major obstacle to training deep networks before techniques like ReLU activation and residual connections were developed."
      }
    ]
  },
  {
    id: 4,
    title: "AI Ethics & Impact",
    description: "Explore important questions about AI ethics, bias, privacy, and societal impact.",
    difficulty: "Intermediate",
    category: "Ethics",
    questions: [
      {
        id: 1,
        question: "What is algorithmic bias in AI systems?",
        options: [
          "When AI runs faster on certain hardware",
          "When AI systems produce unfair outcomes due to biased training data or design",
          "When AI prefers one programming language over another",
          "When AI is optimized for speed over accuracy"
        ],
        correctAnswer: 1,
        explanation: "Algorithmic bias occurs when AI systems produce systematically unfair outcomes, often because they were trained on biased historical data or designed without considering diverse perspectives. This can lead to discrimination in hiring, lending, criminal justice, and other domains."
      },
      {
        id: 2,
        question: "Why is explainability (interpretability) important in AI systems?",
        options: [
          "It makes AI run faster",
          "It allows humans to understand why AI made certain decisions",
          "It reduces the cost of AI systems",
          "It's not important for AI systems"
        ],
        correctAnswer: 1,
        explanation: "Explainability is crucial, especially in high-stakes domains like healthcare and criminal justice, because it allows humans to understand, trust, and verify AI decisions. Without explainability, it's difficult to identify errors, biases, or ensure accountability."
      },
      {
        id: 3,
        question: "What is the primary privacy concern with training large AI models?",
        options: [
          "Models take too long to train",
          "Models may memorize and leak sensitive information from training data",
          "Models require too much electricity",
          "Models are difficult to deploy"
        ],
        correctAnswer: 1,
        explanation: "AI models, especially large language models, can sometimes memorize specific examples from their training data, potentially exposing sensitive information like personal details, copyrighted content, or confidential data if not properly protected."
      },
      {
        id: 4,
        question: "What approach is most effective for addressing AI's impact on employment?",
        options: [
          "Completely stopping AI development",
          "Ignoring the problem as jobs will naturally appear",
          "Investing in reskilling, education, and social safety nets",
          "Only allowing AI in non-work contexts"
        ],
        correctAnswer: 2,
        explanation: "While some jobs will be automated, history shows technology ultimately creates new opportunities. The most effective approach combines reskilling programs, educational reform, social safety nets for transitions, and policies that ensure AI benefits are broadly shared."
      },
      {
        id: 5,
        question: "What does 'AI alignment' refer to?",
        options: [
          "Organizing AI code neatly",
          "Ensuring AI systems act according to human values and intentions",
          "Aligning AI hardware components",
          "Synchronizing multiple AI models"
        ],
        correctAnswer: 1,
        explanation: "AI alignment is the research challenge of ensuring AI systems, especially as they become more powerful, reliably act in accordance with human values and intentions. This becomes increasingly critical as AI systems gain more autonomy and capability."
      }
    ]
  },
  {
    id: 5,
    title: "AI Applications & Real-World Use",
    description: "Test your knowledge of how AI is applied across different industries and domains.",
    difficulty: "Beginner",
    category: "Applications",
    questions: [
      {
        id: 1,
        question: "How do recommendation systems like Netflix and Spotify use AI?",
        options: [
          "They randomly suggest content",
          "They analyze user behavior and preferences to suggest relevant content",
          "They only show the most popular content",
          "They use human curators exclusively"
        ],
        correctAnswer: 1,
        explanation: "Recommendation systems use machine learning to analyze user behavior, preferences, viewing/listening history, and patterns among similar users to suggest content you're likely to enjoy. This personalization is a key application of AI."
      },
      {
        id: 2,
        question: "What AI technique is primarily used in autonomous vehicles for object detection?",
        options: [
          "Natural Language Processing",
          "Computer Vision with Convolutional Neural Networks",
          "Sentiment Analysis",
          "Text Generation"
        ],
        correctAnswer: 1,
        explanation: "Autonomous vehicles rely heavily on computer vision, particularly Convolutional Neural Networks (CNNs), to detect and classify objects like pedestrians, other vehicles, traffic signs, and obstacles in real-time from camera and sensor data."
      },
      {
        id: 3,
        question: "In healthcare, AI is being used for which of the following?",
        options: [
          "Analyzing medical images to detect diseases",
          "Predicting patient health risks",
          "Assisting in drug discovery",
          "All of the above"
        ],
        correctAnswer: 3,
        explanation: "AI is transforming healthcare across multiple areas: analyzing X-rays and MRIs to detect cancer and other conditions, predicting patient risks, accelerating drug discovery, personalizing treatments, and more. Its impact spans diagnosis, treatment, and research."
      },
      {
        id: 4,
        question: "What is Natural Language Processing (NLP) primarily concerned with?",
        options: [
          "Processing images and videos",
          "Enabling computers to understand and generate human language",
          "Controlling robots",
          "Optimizing network traffic"
        ],
        correctAnswer: 1,
        explanation: "Natural Language Processing (NLP) is the branch of AI focused on enabling computers to understand, interpret, and generate human language. Applications include translation, sentiment analysis, chatbots, and text summarization."
      },
      {
        id: 5,
        question: "Which industry benefits from AI-powered fraud detection?",
        options: [
          "Finance and banking",
          "E-commerce",
          "Insurance",
          "All of the above"
        ],
        correctAnswer: 3,
        explanation: "AI-powered fraud detection is used across finance (detecting fraudulent transactions), e-commerce (identifying fake accounts and payment fraud), insurance (detecting false claims), and many other industries where pattern recognition can identify suspicious behavior."
      }
    ]
  }
];

export const categories = [
  { name: "Fundamentals", color: "#3B82F6" },
  { name: "Machine Learning", color: "#8B5CF6" },
  { name: "Deep Learning", color: "#EC4899" },
  { name: "Ethics", color: "#F59E0B" },
  { name: "Applications", color: "#10B981" }
];
