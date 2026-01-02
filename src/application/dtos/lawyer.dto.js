"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LawyerResponseDto = void 0;
class LawyerResponseDto {
    user_id;
    name;
    email;
    is_blocked;
    createdAt;
    mobile;
    role;
    profile_image;
    dob;
    gender;
    Address;
    barcouncil_number;
    verification_status;
    practice_areas;
    experience;
    specialisation;
    consultation_fee;
    description;
    certificate_of_practice_number;
    enrollment_certificate_number;
    constructor(user_id, name, email, is_blocked, createdAt, mobile, role, profile_image, dob, gender, Address, barcouncil_number, verification_status, practice_areas, experience, specialisation, consultation_fee, description, certificate_of_practice_number, enrollment_certificate_number) {
        this.user_id = user_id;
        this.name = name;
        this.email = email;
        this.is_blocked = is_blocked;
        this.createdAt = createdAt;
        this.mobile = mobile;
        this.role = role;
        this.profile_image = profile_image;
        this.dob = dob;
        this.gender = gender;
        this.Address = Address;
        this.barcouncil_number = barcouncil_number;
        this.verification_status = verification_status;
        this.practice_areas = practice_areas;
        this.experience = experience;
        this.specialisation = specialisation;
        this.consultation_fee = consultation_fee;
        this.description = description;
        this.certificate_of_practice_number = certificate_of_practice_number;
        this.enrollment_certificate_number = enrollment_certificate_number;
    }
}
exports.LawyerResponseDto = LawyerResponseDto;
