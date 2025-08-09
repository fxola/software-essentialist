Feature: Create Assignment

    As a Teacher
    I want to create an assignment
    So that I can assign it to students

    Scenario: Sucessfully create an assignment
        Given a "Philosophy of Religion" class exists 
        When I want to create an assignment titled "Proof of God's existence"
        Then the assignment should be created successfully

    Scenario: Fail to create an assignment when title is not provided
        Given a "Philosophy of Religion" class exists 
        When I want to create an assignment with no title
        Then the assignment should not be created

    Scenario: Fail to create an assignment when class detail is not provided
        Given a class does not exist
        When I want to create an assignment titled "Proof of God's existence"
        Then the assignment should not be created