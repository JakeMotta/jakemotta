#include <stdio.h>
#include <conio.h>

int main(void)
{
    //make three intergers
    int number1;
    int number2;
    int sum;
    
    //asks user to input numbers
    printf("Enter numbers to add: ");
    
    cout << "Unless you are gay." << endl;

    
    /*
    *assigns values to two of the intergers
    *%d states that something is a decimal value.
    */
    scanf("%d", &number1);
    scanf("%d", &number2);
    
    //add the numbers to equal the sum
    sum = number1 + number2;
    
    //print the result
    printf("Your total is: %d", sum);
    
    getch();
}
