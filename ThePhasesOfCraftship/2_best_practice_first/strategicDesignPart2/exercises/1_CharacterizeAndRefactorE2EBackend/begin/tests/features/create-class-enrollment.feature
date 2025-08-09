Feature: Create Class Enrollment

    As an Administrator
    I want to enroll a student to a class
    So that the student can attend the class

    Scenario: Sucessfully enroll student to class
        Given a student and class exists 
        When I want to enroll the student to the class
        Then the enrollment should be created successfully

    Scenario: Fail to create an enrollment when student is not provided
        Given a class exists 
        When I want to create an enrollment without a student
        Then the enrollment should not be created

    Scenario: Fail to create an enrollment when class detail is not provided
        Given a student exists
        When I want to create an enrollment without a class
        Then the enrollment should not be created

    Scenario: Fail to create an enrollment when enrollment already exists
        Given an enrollment exists
        When I want to enroll the same student to the same class
        Then the enrollment should not be created
        
    Scenario: Fail to create an enrollment when class does not exist
        Given a student exists
        When I want to enroll the student to a class that does not exist
        Then the enrollment should not be created