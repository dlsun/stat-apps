library(shiny)

# Define UI for app that draws a histogram ----
ui <- fluidPage(
  
  # App title ----
  navbarPage("Distributions", 
  
    tabPanel("Binomial", 
      # Sidebar layout with input and output definitions ----
      sidebarLayout(
        
        # Sidebar panel for inputs ----
        sidebarPanel(
          
          # Input: Slider for the number of bins ----
          sliderInput(inputId = "n",
                      label = "n",
                      min = 1,
                      max = 50,
                      value = 30),
          
          sliderInput(inputId = "p",
                      label = "p",
                      min = 0,
                      max = 1,
                      value = 0.5)
        ),
    
        # Main panel for displaying outputs ----
        mainPanel(
          
          # Output: Histogram ----
          plotOutput(outputId = "distPlot")
        )
      )
    ),
    
    tabPanel("Poisson",
       # Sidebar layout with input and output definitions ----
       sidebarLayout(
         # Sidebar panel for inputs ----
         sidebarPanel(
           
           # Input: Slider for the number of bins ----
           sliderInput(inputId = "x",
                       label = "x",
                       min = 1,
                       max = 50,
                       value = 30),
           
           sliderInput(inputId = "lambda",
                       label = "lambda",
                       min = 0,
                       max = 100,
                       value = 50)
         ),
         
         # Main panel for displaying outputs ----
         mainPanel(
           
           # Output: Histogram ----
           plotOutput(outputId = "poissonPlot")
         )
      )
    )
  )
)

# Define server logic required to draw a histogram ----
server <- function(input, output) {
  
  output$distPlot <- renderPlot({
    
    n <- input$n
    p <- input$p
    
    plot(0:n, dbinom(0:n, size=n, prob=p),type="h",xlab="n", ylab="p", xlim=c(-1,n+1), ylim=c(0,1))
  })
  
  output$poissonPlot <- renderPlot({
    
    x <- input$x
    lambda <- input$lambda
    
    plot(0:x, dpois(0:x, lambda=lambda),type="h",xlab="x", ylab="p", xlim=c(-1,x+1), ylim=c(0,1))

  })
}

shinyApp(ui, server)