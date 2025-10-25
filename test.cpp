#include <iostream>
#include <string>
#include <vector>
#include <cmath>

using namespace std;

int main() {
    cout << "===========================================" << endl;
    cout << "    C++ Compiler Test Program" << endl;
    cout << "===========================================" << endl;
    cout << endl;
    
    // Test 1: Basic I/O
    cout << "Test 1: Basic Input/Output" << endl;
    cout << "Enter your name: ";
    string name;
    getline(cin, name);
    cout << "Hello, " << name << "!" << endl;
    cout << endl;
    
    // Test 2: Arithmetic operations
    cout << "Test 2: Arithmetic Operations" << endl;
    int a = 15, b = 7;
    cout << "a = " << a << ", b = " << b << endl;
    cout << "a + b = " << (a + b) << endl;
    cout << "a - b = " << (a - b) << endl;
    cout << "a * b = " << (a * b) << endl;
    cout << "a / b = " << (a / b) << endl;
    cout << "a % b = " << (a % b) << endl;
    cout << endl;
    
    // Test 3: Floating point operations
    cout << "Test 3: Floating Point Operations" << endl;
    double x = 3.14159, y = 2.71828;
    cout << "x = " << x << ", y = " << y << endl;
    cout << "x + y = " << (x + y) << endl;
    cout << "x * y = " << (x * y) << endl;
    cout << "sqrt(x) = " << sqrt(x) << endl;
    cout << "pow(x, 2) = " << pow(x, 2) << endl;
    cout << endl;
    
    // Test 4: String operations
    cout << "Test 4: String Operations" << endl;
    string str1 = "Hello";
    string str2 = "World";
    string combined = str1 + " " + str2;
    cout << "str1 = " << str1 << endl;
    cout << "str2 = " << str2 << endl;
    cout << "combined = " << combined << endl;
    cout << "Length of combined = " << combined.length() << endl;
    cout << endl;
    
    // Test 5: Array/Vector operations
    cout << "Test 5: Vector Operations" << endl;
    vector<int> numbers = {1, 2, 3, 4, 5};
    cout << "Numbers: ";
    for(int i = 0; i < numbers.size(); i++) {
        cout << numbers[i] << " ";
    }
    cout << endl;
    
    int sum = 0;
    for(int num : numbers) {
        sum += num;
    }
    cout << "Sum of numbers = " << sum << endl;
    cout << endl;
    
    // Test 6: Conditional statements
    cout << "Test 6: Conditional Statements" << endl;
    int age;
    cout << "Enter your age: ";
    cin >> age;
    
    if(age >= 18) {
        cout << "You are an adult." << endl;
    } else if(age >= 13) {
        cout << "You are a teenager." << endl;
    } else {
        cout << "You are a child." << endl;
    }
    cout << endl;
    
    // Test 7: Loop operations
    cout << "Test 7: Loop Operations" << endl;
    cout << "Counting from 1 to 5:" << endl;
    for(int i = 1; i <= 5; i++) {
        cout << "  " << i << endl;
    }
    cout << endl;
    
    // Test 8: Function calls
    cout << "Test 8: Function Calls" << endl;
    auto factorial = [](int n) -> int {
        if(n <= 1) return 1;
        return n * factorial(n - 1);
    };
    
    cout << "Factorial of 5 = " << factorial(5) << endl;
    cout << endl;
    
    cout << "===========================================" << endl;
    cout << "    All tests completed successfully!" << endl;
    cout << "    Your C++ compiler is working properly!" << endl;
    cout << "===========================================" << endl;
    
    return 0;
}
