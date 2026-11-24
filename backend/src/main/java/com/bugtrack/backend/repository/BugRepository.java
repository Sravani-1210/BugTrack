
package com.bugtrack.backend.repository;

import com.bugtrack.backend.entity.Bug;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BugRepository extends JpaRepository<Bug, Long> {

}
