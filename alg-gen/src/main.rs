use std::collections::VecDeque;
use std::collections::HashSet;
use std::fmt::Write as FmtWrite;
use std::fs::File;
use std::io::BufWriter;
use std::io::Write;
use lse_solver::*;


fn main() -> std::io::Result<()> {
    let algs: Vec<Algorithm> = (0..360).into_iter().map(|i| {
        let state = State::create_eo_from_num(i);
        let solution = solution_to_string(solve(state.clone()));
        Algorithm {
            state,
            solution,
        }
    }).collect();

    let file = File::create("algs.json")?;
    let mut writer = BufWriter::new(file);
    serde_json::to_writer_pretty(&mut writer, &algs)?;
    writer.flush()?;
    Ok(())
}

fn solve(state: State) -> Vec<Move> {
    let mut q: VecDeque<Vec<Move>> = VecDeque::new();
    let visited: HashSet<State> = HashSet::new();

    q.push_back(Vec::new());
    while let Some(curr_moves) = q.pop_front() {
        let curr_state = state.apply_all(&curr_moves);
        if curr_state.is_solved() {
            return curr_moves;
        }
        if visited.contains(&curr_state) {
            continue;
        }

        match curr_moves.last() {
            Some(Move::M) | Some(Move::Mp) | Some(Move::Mt) => {
                q.push_back(curr_moves.with_push(Move::U));
                q.push_back(curr_moves.with_push(Move::Up));
                q.push_back(curr_moves.with_push(Move::Ut));
            },
            Some(Move::U) | Some(Move::Up) | Some(Move::Ut) => {
                q.push_back(curr_moves.with_push(Move::M));
                q.push_back(curr_moves.with_push(Move::Mp));
                q.push_back(curr_moves.with_push(Move::Mt));
            },
            None => {
                q.push_back(curr_moves.with_push(Move::M));
                q.push_back(curr_moves.with_push(Move::Mp));
                q.push_back(curr_moves.with_push(Move::Mt));
                q.push_back(curr_moves.with_push(Move::U));
                q.push_back(curr_moves.with_push(Move::Up));
                q.push_back(curr_moves.with_push(Move::Ut));
            },
        }
    }
    return Vec::new();
}

fn solution_to_string(moves: Vec<Move>) -> String {
    let mut s = String::new();

    for (i, m) in moves.iter().enumerate() {
        match m {
            Move::M => write!(s, "M").unwrap(),
            Move::Mp => write!(s, "M'").unwrap(),
            Move::Mt => write!(s, "M2").unwrap(),
            Move::U => write!(s, "U").unwrap(),
            Move::Up => write!(s, "U'").unwrap(),
            Move::Ut => write!(s, "U2").unwrap(),
        }
        if i != moves.len() - 1 {
            write!(s, " ").unwrap();
        }
    }
    s
}
